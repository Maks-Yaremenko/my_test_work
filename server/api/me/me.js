'use strict';

var models = require(process.cwd() + '/server/models'),
_ = require('lodash');

exports.get = function (req, res, next) {
	if(!req.user || !req.user.id) {
		return res.status(401).json({});
	}

	models.user.findOne({
		where: {id: req.user.id},
		attributes: ['id', 'phone', 'email', 'name']
	}).then(function (user) {
		if(!user) {
			return res.status(401).json({});
		}
		return res.json(user);
	}).catch(function (err) {
		next(err);
	});
};

exports.update = function (req, res, next) {

	if(!req.user) return res.status(401).json({});

	if(req.body && req.body.new_password && (!req.body.current_password || !(req.body.current_password.length >= 4)))
		return res.status(422).json({field:"current_password", message: "Wrong current password" });

	models.user.findById(req.user.id)
		.then(function (user) {
			if(!user) res.status(401).json({});

			if(req.body.new_password && !user.authenticate(req.body.current_password)) {
				return res.status(422).json({ field: "current_password", message: "Wrong current password" });
			}else{
				user.password = req.body.new_password;
			}

			user = _.merge(user, req.body);
			user
				.save()
				.then(function (user) {
					
					models.user.findOne({
						where: {id: user.id},
						attributes: ['id','phone','email','name']
					}).then(function (user) {
						return res.json(user);
					}).catch(function (err) {
						next(err);
					});
				}).catch(function (err) {
					next(err);
				});

		}).catch(function (err) {
			next(err);
		});
};