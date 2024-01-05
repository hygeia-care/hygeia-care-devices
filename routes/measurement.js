var express = require('express');
var router = express.Router();

const MeasurementType = {
	BloodPressure: Symbol("bloodPressure"),
	BloodSugar: Symbol("bloodSugar"),
	HeartRate: Symbol("heartRate"),
	VO2: Symbol("VO2")
}


/* GET measurements listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
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

/* PATCH measurement/:id */


module.exports = router;
