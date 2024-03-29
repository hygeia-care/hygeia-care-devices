var express = require('express');
var router = express.Router();
var Measurement = require('../models/measurement')
var debug = require('debug')('analysis-2:server')
var axios = require('axios');
var verifyToken = require('../verifyJWTToken');
require('dotenv').config();

const MeasurementType = {
    BloodPressure: Symbol("bloodPressure"),
    BloodSugar: Symbol("bloodSugar"),
    HeartRate: Symbol("heartRate"),
    VO2: Symbol("VO2")
}

/* GET measurements listing. */
router.get('/', async function (req, res, next) {
    try {
        await verifyToken(req.headers['x-auth-token'], res);
    } catch (e) {
        return;
    }

    try {
        const result = await Measurement.find();
        res.send(result.map((c) => c.cleanup()));
    } catch (e) {
        debug("DB problem", e);
        res.sendStatus(500);
    }
});

/* GET measurement/id */
router.get('/:id', async function (req, res, next) {

    try {
        await verifyToken(req.headers['x-auth-token'], res);
    } catch (e) {
        return;
    }

    var id = req.params.id;
    try {
        const result = await Measurement.find({ _id: id });
        if (result.length == 0) {
            res.status(404).json({ message: 'No measurement found with the given id: ' + id });
            return;
        }
        res.send(result[0].cleanup());
    } catch (e) {
        debug("DB problem", e);
        res.sendStatus(500);
    }
});

/* POST measurement */
router.post('/', async function (req, res, next) {
    token = req.headers['x-auth-token']
    try {
        await verifyToken(token, res);
    } catch (e) {
        return;
    }

    const { title, date, comment, type, user } = req.body;

    try {
        // Verify that this user exists.
        const authToken = process.env.USER_SERVICE_API_KEY;
        userServiceURL = process.env.USER_SERVICE_URL
        response = await axios.get(userServiceURL + "users/" + user,
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            });
    } catch (e) {
        if (e.errors) {
            res.status(404).send({ error: "Measurement not created because no user was found with id " + user });
        } else {
            res.status(500).send({ error: "Unable to verify user, measurement not created: " + e.message });
        }
        return;
    }

    const measurement = new Measurement({
        title, date, comment, type, user
    });

    try {
        await measurement.save();
        return res.sendStatus(201);
    } catch (e) {
        if (e.errors) {
            debug("Validation prblem when saving");
            res.status(400).send({ error: e.message });
        } else {
            debug("DB problem", e);
            res.sendStatus(500)
        }
    }

});


/* POST measurement using Google Healthcare API Integration */
router.post('/exportStandardized/:measurementId', async function (req, res, next) {

    try {
        await verifyToken(req.headers['x-auth-token'], res);
    } catch (e) {
        return;
    }

    var measurementId = req.params.measurementId;
    try {
        const result = await Measurement.find({ _id: measurementId });
        if (result.length == 0) {
            res.status(404).json({ message: 'No measurement found with the given id' });
            return;
        }

        try {
            console.log("Attempting communication with google Healthcare API");
            // Access the Google Healthcare API Auth token from the environment variable
            const authToken = process.env.GOOGLE_HEALTHCARE_API_AUTH;

            // Request the standardized version of the measurement
            const response = await axios.post('https://healthcare.googleapis.com/v1/projects/formidable-era-410617/locations/europe-west4/services/nlp:analyzeEntities', {
                documentContent: result[0].comment
            }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            // Return standardized format
            res.status(201).json(response.data);
        }
        catch (e) {
            debug("Error communicating with google healthcare API", e);
            res.status(500).send({ error: "Error communicating with google healthcare API: " + e.message });
            return;
        }
    } catch (e) {
        if (e.errors) {
            debug("Validation prblem when saving");
            res.status(400).send({ error: e.message });
        } else {
            debug("DB problem", e);
            res.sendStatus(500)
        }
    }

});

/* PATCH measurement/:id */
router.patch('/:id', async function (req, res, next) {
    try {
        await verifyToken(req.headers['x-auth-token'], res);
    } catch (e) {
        return;
    }

    var id = req.params.id;
    const { title, date, comment, type, user } = req.body;

    const updatesDict = {};

    if (title !== null && title !== undefined) {
        updatesDict.title = title;
    }

    if (date !== null && date !== undefined) {
        updatesDict.date = date;
    }

    if (comment !== null && comment !== undefined) {
        updatesDict.comment = comment;
    }

    if (type !== null && type !== undefined) {
        updatesDict.type = type;
    }

    if (user !== null && user !== undefined) {
        updatesDict.user = user;
    }

    const update = {
        $set: updatesDict
    };

    try {
        const result = await Measurement.updateOne({ _id: id }, update);
        if (!result.acknowledged) {
            debug("DB problem with measurement update - not acknowledged");
            res.sendStatus(500);
        } else {
            const result = await Measurement.find({ _id: id });
            res.send(result[0].cleanup());
        }
    } catch (e) {
        debug("DB problem", e);
        res.sendStatus(500);
    }
});

module.exports = router;
