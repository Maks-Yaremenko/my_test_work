'use strict';

var express     = require('express');
var controller  = require('./me');
var router      = express.Router();
var authenticate = require(process.cwd() + '/server/api/authenticate/authenticate');

router.get('/', authenticate.isAuthenticated(), controller.get);
router.put('/', authenticate.isAuthenticated(), controller.update);

module.exports = router;
