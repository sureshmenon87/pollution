var express = require('express');
var router = express.Router();
var userController=require('../controllers/userController.js');
const validator = require('express-joi-validation')({passError: true})
const Joi = require('joi');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

const verifySchema = Joi.object().keys({
  mobileNo: Joi.number(),
  countryCode: Joi.string().min(2).max(2).required(),
})

authSchema = Joi.object().keys({
  mobileNo: Joi.number(),
  countryCode: Joi.string().min(2).max(2).required(),
  otp: Joi.number()
})

const profileSchema = Joi.object().keys({
  name: Joi.string().min(3).max(30).required(),
  gender: Joi.string(),
  age: Joi.number().integer().max(100),
  email: Joi.string().email({ minDomainAtoms: 2 }),
  mobile: Joi.number().required()
})

const pollutionReportSchema = Joi.object().keys({
  vehicle: Joi.string().valid("van", "bus", "truck", "bike", "auto", "car" ).required(),
  vehicleNo: Joi.string(),
  emissionColor: Joi.string().valid("white", "black", "gray").required(),
  numberPlateColor :Joi.string().valid("yellow", "black", "gray","red","green","blue").required(),
  geoCoordinates:Joi.array().items(Joi.number()).length(2),
  country:Joi.string().valid('IN'),
  state:Joi.string(),
  city:Joi.string()

})



router.post('/verify', validator.body(verifySchema), function(req, res, next) {
  userController.verify(req, res)
});

/* GET users listing. */
router.post('/authenticate', validator.body(authSchema), function(req, res, next) {
  userController.authenticate(req, res)
});


router.put('/profile', validator.body(profileSchema), function(req, res, next) {
  userController.updateProfile(req, res)
});



/*

//validator.body(pollutionReportSchema) upload.single('vehiclePhoto')
router.post('/reports/pollutions' ,validator.body(pollutionReportSchema),function(req, res, next) {
    userController.reportPollution(req, res)
});
router.post('/registration/otp', function(req, res, next) {
  userController.validateRegistrationOTP(req, res)
});

router.post('/login/otp', function(req, res, next) {
  userController.validateLoginOTP(req, res)
});
router.post('/login', function(req, res, next) {
  userController.login(req, res);
});

router.get('/', function(req, res, next) {
  userController.getUserDetails(req, res);
});

router.post('/', function(req, res, next) {
  userController.post(req, res)
});

router.post('/logout', function(req, res, next) {
  userController.deleteAuthToken(req, res)
});
router.delete('/:id', function (req, res, next) {
  userController.delete(req, res)
});
router.put('/', function (req, res, next) {
  userController.updateUserDetails(req, res)
});*/

module.exports = router;
