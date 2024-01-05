var express = require('express');
var router = express.Router();

// TODO 
/* GET analyses listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
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

module.exports = router;
