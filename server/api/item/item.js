"use strict";

var fs = require('fs'),
models = require(process.cwd() + '/server/models'),
_ = require('lodash'),
sanitizeHtml = require('sanitize-html'),
config = require(process.cwd()+ '/server/config');

var validationError = function(res, err) {
	for (var i = 0; i < err.errors.length; i++) {
		if (err.errors[i].type === 'notNull Violation' || err.errors[i].type === 'Validation error') {
			return res.status(422).json({
				"field": err.errors[i].path,
				"message": err.errors[i].message
			});
		}
	}
};

exports.create = function (req, res, next) {

	if(!req.body.title){
		return res.status(422).json({field: "title", message: "title field is empty"});
	};

	req.body.title = sanitizeHtml(req.body.title);
	req.body.price = parseFloat(req.body.price);
	req.body.userId = req.user.id;

	models.item.create(req.body)
		.then(function (item) {
			return models.item.findOne({
				where: {id: item.id},
				include : [{
					model: models.user,
					attributes: ['id', 'phone', 'email', 'name']
				}]
			});

		})
		.then(function (item) {
			return res.json(item);	
		})
		.catch(function (err) {
			validationError(res, err);
		});
};

exports.search = function (req, res, next) {

var User = {}, params = {};
var order = ['createdAt', 'DESC'];

	if(req.query.title) params.title = req.query.title;

	if(req.query.user_id) User.id = req.query.user_id;
	if(req.query.order_by === 'price') order[0] = req.query.order_by;
	if(req.query.order_by === 'created_at') order[0] = 'createdAt';
	if(req.query.order_type === 'asc') order[1] = req.query.order_type;

	models.item.findAll({
		order: [order],
		include : [{
			where: User,
            model: models.user,
            attributes: ['id', 'phone', 'email', 'name']
		}], where: params
	}).then(function (item) {
		return res.json(item);
	}).catch(function (err) {
		next(err);
	});
};

exports.getById = function (req, res, next) {

	console.log(req.params);
	models.item.findOne({
		where: {id: req.params.id},
		include : [{
			model: models.user,
			attributes: ['id', 'phone', 'email', 'name']
		}]
	}).then(function (item) {
		if(item) { 
			res.json(item) 
		}else{
			res.status(404).json({});
		}
	}).catch(function (err) {
		next(err);
	})
}

exports.update = function (req, res, next) {

	if(req.body.title.length <= 2){
		return res.status(422).json({field: "title", message: "Title should contain at least 3 characters"});
	};

	if(req.body.title) req.body.title = sanitizeHtml(req.body.title);
	if(req.body.price) req.body.price = parseFloat(req.body.price);

	models.item.findOne({
		where: {id: req.params.id},
		include: [{
			model: models.user,
			attributes: ['id', 'phone', 'email', 'name']
		}]
	}).then(function (item) {
		if(!item) return res.status(404).json({});
		if(item.userId !== req.user.id) return res.status(403).json({});

		item = _.merge(item, req.body);

		item.save().then(function (item) {
			return res.json(item);
		}).catch(function (err) {
			next(err);
		});
	}).catch(function (err) {
		validationError(res, err);
	});
};

exports.destroy = function (req, res, next) {

	models.item.findById(req.params.id).then(function (item) {

		if(!item) return res.status(404).json({});
		if(item.userId !== req.user.id) return res.status(403).json({});

		item.destroy().then(function () {
			return res.status(200).json({});
		}).catch(function (err) {
			next(err);
		});

	}).catch(function (err) {
		next(err);
	});
};

exports.uploadImage = function (req, res, next) {

	if(req.files.file) {
		models.item.findOne({
			where: { id: req.params.id},
			include: [{
				model: models.user,
				attributes: ['id', 'phone', 'email', 'name']
			}]
		}).then(function (item) {
			if(!item) return res.status(404).json({});
			if(item.userId !== req.user.id) return res.status(403).json({});
			if(item.image) fs.unlinkSync(config.uploadDir +'/'+ item.image);
			   
			var file = req.files.file.path;
           	item.image = file.substring(file.lastIndexOf("\\") + 1, file.length);
			
			item
				.save()
				.then(function (item) {
					return res.json(item);
				})
				.then(function (err) {
					next(err);
				});
		}).catch(function (err) {
			next(err);
		});
	};
};

exports.deleteImage = function (req, res, next) {

		models.item.findById(req.params.id)
			.then(function (item) {

			if(!item) { return res.status(404).json({}); }
			if (item.userId !== req.user.id) { return res.status(403).json({}); }
			if(item.image) fs.unlinkSync(config.uploadDir +'/'+ item.image);

			item.image = null;

			item.save()
				.then(function () {
					return res.status(200).json({});
				}).catch(function (err) {
					next(err);
				});
		});
};