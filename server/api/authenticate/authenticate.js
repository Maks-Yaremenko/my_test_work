"use strict"

var jwt = require('jsonwebtoken'),
config = require(process.cwd() + '/server/config'),
expressJwt = require('express-jwt'),
compose = require('composable-middleware'),
models = require(process.cwd() + '/server/models');

var validateJwt = expressJwt({
	secret: config.secrets
});

var validationError = function (res, err) {
	for (var i = 0; i < err.errors.length; i++) {
		if (err.errors[i].type === 'notNull Violation' || err.errors[i].type === 'Validation error') {
			res.status(422).json({
				"field": err.errors[i].path,
				"message": err.errors[i].message
			})
		}
	}
};

function register(req, res, next) {
	if( req.body.password.length <= 4) {
		res.status(422).json({"field":"current_password","message":"Wrong current password"});
	}else{
		models.user.create(req.body)
			.then(function (user) {
				res.status(200).json({"token": signToken(user.id)});
			})
			.catch(function (err) {
				return validationError(res, err);
			});
	}
};

function login(req, res, next) {
		models.user.findOne({
			where: { 
				"email": req.body.email 
			}
		}).then(function (user) {
			if(!user || !user.authenticate(req.body.password)) {
				res.status(422).json({field: "password", message: "Wrong email or password"});
			}
			res.json({"token": signToken(user.id)});
		})
		.catch(function (err) {
			return validationError(res, err);
		});
};

function signToken(id) {
	return jwt.sign(
		{ id: id },
		config.secrets,
		{ expiresIn: "24h" }
	);
};

function isAuthenticated() {
	return compose()
		.use(function (req, res, next) {
			if(req.headers.authorization) {
				req.headers.authorization = 'Bearer ' + req.headers.authorization;
				validateJwt(req, res, next);
			}else{
				return res.status(401).json({});
			};
		})
		.use(function (req, res, next) {

			models.user.findById(req.user.id)
				.then(function (user) {
					if(!user) {
						return res.status(401).json({});
					};
					req.user = user;
					next();
				});
		});
};

exports.isAuthenticated = isAuthenticated;
exports.register = register;
exports.login = login;