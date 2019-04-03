var express = require('express');
var router = express.Router();
let multer  = require('multer');
var vehicleController=require('../controllers/vehicleController');
let storage = require('./gridfs')();
let upload = multer({ //multer settings for single upload
  storage: storage
}).single('file');

router.get('/', function (req, res, next) {
  vehicleController.searchVehicles(req, res);
});

router.get('/photo/:id', function (req, res, next) {
    vehicleController.getVehiclePhoto(req, res);
});

router.post('/photo',upload,(req, res, next)=>{
vehicleController.vehiclePhoto(req, res);
});  

router.post('/pollution',(req, res, next)=>{
  vehicleController.reportVehiclePollution(req, res);
  }); 

  
router.get('/pollution/:id',(req, res, next)=>{
  vehicleController.getPollutionById(req, res);
}); 
 









module.exports = router;
