'use strict';

var models = require(process.cwd() + '/server/models');

exports.get = function (req, res, next) {
	models.user.findOne({
		where: { id: req.params.id },
		attributes: ['id', 'phone', 'email', 'name']
	}).then(function (user) {

		if (!user) {
			return res.status(404).json({});
		};
		return res.json(user);
		
	}).catch(function (err) {
		next(err);
	});
};

exports.search = function (req, res, next) {
	var params = {};

	if(req.query.name) 
		params.name = req.query.name;
	if(req.query.email)
		params.email = req.query.email;

	models.user.findAll({
		where: params,
		attributes: ['id', 'name', 'email', 'phone']
	}).then(function (users) {
		return res.json(users);
	}).catch(function (err) {
		next(err);
	});
};