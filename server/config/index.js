'use strict';

var _ = require('lodash');
var fs = require('fs');

var config = {
	env: process.env.NODE_ENV || 'development',
	root: process.cwd(),
	port: process.env.PORT || 8080,
	secrets: fs.readFileSync(__dirname + '/private.key'),
	uploadDir: 	process.cwd() +'/server/public/images'
};

module.exports = config;