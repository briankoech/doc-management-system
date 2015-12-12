(function() {
  'use strict';
  var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    config = require('./server/config/config'),
    routes = require('./server/routes'),
    app = express();

  // establish connection to mongoose
  mongoose.connect(config.database, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('connected to the database');
    }
  });

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(morgan('dev'));

  // all our routes goes here
  routes(app, express);

  app.listen(config.port, function(err) {
    if (err) throw err;
    console.log('listening on port:' + config.port);
  });
})();
