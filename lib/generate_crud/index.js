var fs=require("fs");
const CONTROLLER_PATH="../controllers/"
const SERVICES_PATH="../services/"
const ROUTER_PATH="../routes/";



function getControllerFile(className , classInstance, provider){
//Start
return str="let "+provider+" = require('../services/"+provider+".js');"+
"class "+className+ "{"+
"post(req, res) {"+
"       "+provider+".post(req.body).then(function (data) {"+
"           res.status(200).send(data);"+
"       }).catch(function (err) {"+
"           return res.boom.badImplementation(err);"+
"       });"+
"   }"+

"   put(req, res) {"+
    "       "+provider+".put(req.params.id, req.body).then(function (data) {"+
        "       res.status(200).send(data);"+
        "}).catch(function (err) {"+
            "   return res.boom.badImplementation(err);"+
            "});"+
            "    }"+


            "    delete(req, res) {"+
            ""+provider+".delete(req.params.id).then(function (data) {"+
            "          res.status(200).send(data);"+
            "}).catch(function (err) {"+
            "return res.boom.badImplementation(err);"+
            "});"+
            " }"+


            " get(req, res) {"+
                "    "+provider+".get(req.params.id).then(function (data) {"+
                    "        res.status(200).send(data);"+
                    "   }).catch(function (err) {"+
                        "       return res.boom.badImplementation(err);"+
                        "  });"+
                        " }"+
                        "  getAll(req, res) {"+
                            "  "+provider+".getAll().then(function (data) {"+
            "res.status(200).send(data);"+
            "   }).catch(function (err) {"+
                "       return res.boom.badImplementation(err);"+
                "   });"+
                "  }"+

"}"+

"let "+classInstance+" = new "+className+ "();"+
"module.exports = "+classInstance+";"
//End

}




  function getProviderFile(className, classInstance, modelName, modelInstance, modelFile){
//Start
  return str="let "+modelName+" = require('../models/"+modelFile+"');"+
  "class "+className+" {"+
  "   post(payload) {"+
  "       payload.createdAt = new Date();"+
  "       payload.updatedAt = new Date();"+
  "       var "+modelInstance+" = new "+modelName+"(payload);"+
  "       return "+modelInstance+" .save()"+
  "   }"+
  "   put(id, payload) {"+
  "       payload.updatedAt = new Date();"+
  "       return "+modelName+".update({ _id: id }, { $set: payload }, { new: true });"+
  "   }"+
  "   delete(id) {"+
  "       return "+modelName+".update({ _id: id }, { $set: { status: 0 } });"+
  "   }"+
  
  "   get(id) {"+
    "       return "+modelName+".findById({ _id: id })"+
    " }"+
    "    getAll() {"+
        "  return "+modelName+".find({})"+
          "   }"+
  
          " }"+
          "let "+classInstance+" = new "+className+"();"+
  " module.exports = "+classInstance+";"
//End

  }



  function getRouter(controller){

    return str = 
    
    "var express = require('express');"+
    "var router = express.Router();"+
    "var "+controller+" = require('../controllers/"+controller+".js');"+
    
    /* GET users listing. */
    "router.get('/:id', function (req, res, next) {"+
    ""+controller+".get(req, res);"+
        "});"+
    
    "router.get('/', function (req, res, next) {"+
    ""+controller+".getAll(req, res);"+
        "});"+
    
    
    "router.post('/', function (req, res, next) {"+
    ""+controller+".post(req, res)"+
        "});"+
    
    "router.put('/:id', function (req, res, next) {"+
    ""+controller+".put(req, res)"+
        "});"+
    
    "router.delete('/:id', function (req, res, next) {"+
    ""+controller+".delete(req, res)"+
        "});"+
    "module.exports = router;"    
    
  }



//className, classInstance, modelName, modelInstance, modelFile
  fs.writeFile(SERVICES_PATH+"productionProvider.js",getProviderFile("ProductionProvider","productionProvider","ProductionModel","productionModel","production.js"), function (err) {
    if (err) throw err;
    console.log('Create Provider!');
  });



// className , classInstance, provider
  fs.writeFile(CONTROLLER_PATH+"productionController.js",getControllerFile("ProductionController","productionController","productionProvider"), function (err) {
    if (err) throw err;
    console.log('Created Controller!');
  });

  
  fs.writeFile(ROUTER_PATH+"production.js",getRouter("productionController"), function (err) {
    if (err) throw err;
    console.log('Created Router!');
  });