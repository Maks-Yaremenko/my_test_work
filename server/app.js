'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
global.APP_DIR      = __dirname;

var express = require('express'),
conf = require(APP_DIR + '/config');

var app = express(); app.disable('x-powered-by');
var server = require('http').createServer(app);

require(APP_DIR + '/config/express')(app);
require(APP_DIR + '/routes.js')(app);

server.listen(conf.port, function(){
  console.log('Express server listening on port %d in %s mode', conf.port, app.get('env'));
});

var exports = module.exports = app;