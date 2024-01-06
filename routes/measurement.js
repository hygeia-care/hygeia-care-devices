var express = require('express');
var router = express.Router();
var Measurement = require('../models/measurement')
var debug = require('debug')('analysis-2:server')

const MeasurementType = {
    BloodPressure: Symbol("bloodPressure"),
    BloodSugar: Symbol("bloodSugar"),
    HeartRate: Symbol("heartRate"),
    VO2: Symbol("VO2")
}


/* GET measurements listing. */
router.get('/', async function (req, res, next) {
    try {
        const result = await Measurement.find();
        res.send(result);
    } catch (e) {
        debug("DB problem", e);
        res.sendStatus(500);
    }
});

/* GET measurement/id */
router.get('/:id', async function (req, res, next) {
    var id = req.params.id;
    // TODO placeholder, implement db fetch
    result = {
        "id": "hashId" + id,
        "title": "bloodPressure Device3",
        "date": new Date(),
        "comment": "Doctor's comments",
        "type": MeasurementType.BloodPressure,
        "user": "todo - id or relationship"
    }
    res.send(result);
});

/* POST measurement */
router.post('/', async function (req, res, next) {
    const { title, comment, type, user } = req.body;

    // TODO change this to a user defined date.
    // -> this isn't working rn anyway...
    creationDate = new Date();
    const measurement = new Measurement({
        title, creationDate, comment, type, user
    });

    try {
        await measurement.save();
        return res.sendStatus(201);
    } catch (e) {
        debug("DB problem", e);
        res.sendStatus(500)
    }

});

/* PATCH measurement/:id */


module.exports = router;
