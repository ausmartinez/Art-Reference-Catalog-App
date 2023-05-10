const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dbClient = require('./dbClient');
const _config = require('./.config.js');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

///TODO:: there is a space before certain elements when pushing to database

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'images')));

// Routes
app.use('', require('./routes/index'));
app.use('/', require('./routes/index'));
app.use('/getImages', require('./routes/getImages'));
app.use('/uploadImage', require('./routes/uploadImage'));
app.use('/updateImage', require('./routes/updateImage'));
app.use('/deleteImage', require('./routes/deleteImage'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {status: err});
});

module.exports = app;

/* Run the app */
dbClient.connectToDatabase((err, db) => {
  if (err) console.log(err);
  let port = 8080;
  app.listen(port, () => {
    console.log("App running on port:", port);
  });
});



/*
path          string
tags          array(strings)
characters    array(strings)
shows         array(strings)
gender        string
porn          boolean
nsfw          boolean
*/
