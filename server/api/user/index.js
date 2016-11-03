'use strict';

var express     = require('express');
var controller  = require('./user');
var router      = express.Router();
var authenticate = require(process.cwd() + '/server/api/authenticate/authenticate');

router.get('/', controller.search);
router.get('/:id', authenticate.isAuthenticated(), controller.get);

module.exports = router;
