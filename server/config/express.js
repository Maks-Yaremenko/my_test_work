'use strict'

var express = require('express'),
bodyParser = require('body-parser'),
methodOverride = require('method-override'),
path = require('path'),
config = require('./index'),
morgan = require('morgan');

module.exports = function (app) {
    var env = app.get('env');

    app.use(bodyParser.urlencoded({limit: '5mb', extended: false }));
    app.use(bodyParser.json({limit: '5mb'}));
    app.use(methodOverride());
    app.set('appPath', config.root);
    app.use(express.static(app.get('appPath')));
    app.use(morgan('dev'));
 };

