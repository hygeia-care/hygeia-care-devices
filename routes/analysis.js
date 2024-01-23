var express = require('express');
var router = express.Router();
var Analysis = require('../models/analysis');
var Measurement = require('../models/measurement');
var debug = require('debug')('analysis-2:server');
var verifyToken = require('../verifyJWTToken');

/* GET analysis/:id */
router.get('/:id', async function (req, res, next) {

  try {
    await verifyToken(req.headers['x-auth-token'], res);
  } catch (e) {
    return;
  }

  var id = req.params.id;
  try {
    const result = await Analysis.find({ _id: id });
    if (result.length == 0) {
      res.status(404).json({ message: 'No analyses found with the given id' });
      return;
    }
    res.send(result[0].cleanup());
  } catch (e) {
    debug("DB problem", e);
    res.sendStatus(500);
  }
});

/* DELETE analysis*/
router.delete('/:id', async function (req, res, next) {

  try {
    await verifyToken(req.headers['x-auth-token'], res);
  } catch (e) {
    return;
  }

  var id = req.params.id;
  try {
    const result = await Analysis.deleteOne({ _id: id });
    if (result.deletedCount != 1) {
      res.status(404).send({ error: "Analysis object with id " + id + " not found" });
    } else if (!result.acknowledged) {
      debug("DB problem", e);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  } catch (e) {
    debug("DB problem", e);
    res.sendStatus(500);
  }
});


/* POST */
router.post('/', async function (req, res, next) {

  try {
    await verifyToken(req.headers['x-auth-token'], res);
  } catch (e) {
    return;
  }

  const { value, measurement } = req.body;

  const analysis = new Analysis({
    value,
    measurement
  });

  try {
    await analysis.save();
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


// Define a route to find Analysis objects based on userId query parameter
router.get('/', async (req, res) => {

  try {
    await verifyToken(req.headers['x-auth-token'], res);
  } catch (e) {
    return;
  }

  try {
    const userId = req.query.userId;

    if (!userId) {
      // Without userId return all analyses
      try {
        const result = await Analysis.find();
        res.send(result.map((c) => c.cleanup()));
        return;
      } catch (e) {
        debug("DB problem", e);
        res.sendStatus(500);
        return;
      }
    }

    // Specify the filter to find the documents with the given userId
    var filter = { user: userId };

    // Use find to retrieve the documents that match the filter
    const measurementObjects = await Measurement.find(filter);

    if (measurementObjects.length == 0) {
      res.status(404).json({ message: 'No analyses found for the given userId' });
      return;
    }

    const measurementIds = []

    for (index in measurementObjects) {
      measurementIds.push(String(measurementObjects[index]._id))
    }

    filter = { measurement: { $in: measurementIds } };

    // Use find to retrieve the documents that match the filter
    const analysisObjects = await Analysis.find(filter)

    if (analysisObjects.length == 0) {
      res.status(404).json({ message: 'No analyses found for the given userId' });
    } else {
      res.send(analysisObjects.map((c) => c.cleanup()));
    }
  } catch (error) {
    console.error('Error finding Analyses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
