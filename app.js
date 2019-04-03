var createError = require('http-errors');
var express = require('express');
var boom = require('express-boom');
var path = require('path');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var logger = require('./lib/logger');
var indexRouter = require('./lib/routes/index.js');
var usersRouter = require('./lib/routes/users.js');
var vehicleRouter = require('./lib/routes/vehicles.js');
var userProvider = require('./lib/services/userProvider.js');
var Router = require('./lib/routes/');
var app = express();
//var bb = require('express-busboy');
/*bb.extend(app, {
  upload: true
});*/
var err = new Error('Unauthorized');
err.status = 401;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));
app.use(boom());

app.use(function (req, res, next) {
  
  if (
    req.path === '/users/authenticate' ||
    req.path === '/users/verify') {
    next();
  } else if (req.headers.authorization) {
    jwt.verify(req.headers.authorization, 'vmenosu', function (err, tokenDecoded) {
      if (err) {
        logger.error("jwt validation failed:", err);
        res.boom.unauthorized(err);
        next(err);
      } else {
        logger.info('Authenticated...');
        logger.info('Check token issuer',tokenDecoded);
        req.userContext = tokenDecoded;
        next();
        /*
        userProvider.getAuthToken(req.headers.authorization, res).then(function (doc) {
          if (!doc || doc.length === 0) {
            res.boom.unauthorized(err);
            next(err);
            return;
          }
          next();
        }).catch(function (err) {
          logger.error('error occurred in getAuthToken', err);
          res.boom.unauthorized(err);
          next(err);
        })*/
      }
    });

  } else {
    res.boom.unauthorized(err);
    next(err);
  }

});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/vehicles', vehicleRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err.error);
  if (err.error && err.error.isJoi) {
    // we had a joi error, let's return a custom 400 json response
    res.status(400).json({
      type: err.type, // will be "query" here, but could be "headers", "body", or "params"
      message: err.error.toString()
    });
  } else {
    // pass on to another error handler
    next(err);
  }

});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
  
});

module.exports = app;
