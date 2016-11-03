"use strict"

var express     = require('express');
var controller  = require('./item');
var router      = express.Router();
var multipart   = require('connect-multiparty');
var config      = require(process.cwd()+ '/server/config');
var authenticate = require(process.cwd() + '/server/api/authenticate/authenticate');

router.get('/', controller.search );
router.get('/:id', controller.getById);

router.post('/', authenticate.isAuthenticated(), controller.create);
router.put('/:id', authenticate.isAuthenticated(), controller.update);
router.delete('/:id', authenticate.isAuthenticated(), controller.destroy)

router.post('/:id/image', authenticate.isAuthenticated(), multipart({uploadDir: config.uploadDir}), controller.uploadImage);
router.delete('/:id/image', authenticate.isAuthenticated(), controller.deleteImage);

module.exports = router;
