var express = require('express');
var router = express.Router();
var Analysis = require('../models/analysis')
// This might not work... 7:07 in step 2
var debug = require('debug')('analysis-2:server')

// TODO 
/* GET analyses listing. */
router.get('/', async function (req, res, next) {
  try {
    const result = await Analysis.find();
    res.send(result.map((c) => c.cleanup()));
  } catch (e) {
    debug("DB problem", e);
    res.sendStatus(500);
  }
});

/* GET analysis/:id */
router.get('/:id', async function (req, res, next) {
  var id = req.params.id;
  // TODO placeholder, implement db fetch
  result = { "id": "hashId" + id, "value": 123, "measurement": "todo - id maybe? Or relationship" }
  res.send(result);
});

/* GET analysis?user=:id */

/* DELETE analysis*/

/* POST */
router.post('/', async function (req, res, next) {
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

module.exports = router;
