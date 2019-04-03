var express = require('express');
const geo= require('countrycitystatejson')
var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

router.get('/countries', function (req, res, next) {
  res.json(geo.getCountries());
});

router.get('/countries/:id', function (req, res, next) {
  res.json(geo.getCountryInfoByShort(req.params.id));
});

router.get('/countries/:id/states', function (req, res, next) {
  res.json(geo.getStatesByShort(req.params.id));
});

router.get('/countries/:country/states/:state', function (req, res, next) {
  res.json(geo.getCities(req.params.country,req.params.state ));
});



module.exports = router;
