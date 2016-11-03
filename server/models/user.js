'use strict';

var crypto  = require('crypto');

module.exports = function (sequelize, DataTypes) {
	var User = sequelize.define('user', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			set: function (password) {
				this.salt = this.makeSalt();
				this.iteration = this.makeIteration();
				this.setDataValue('password', this.getHash(password));
			}
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isEmail: {msg: "there is some mistake in email adress"}, 
                notEmpty: {msg: "Email field is empty"},
                isUnique: function (value, next) {
                    if (this.id && this.email === value) {
                        return next();
                    };

                    User.find({
                        where: {email: value},
                        attributes: ['id']
                    }).then(function (user) {
                        user ? next({msg: "Email is allready registered"}) : next();
                    }, next);
                }
            }
        },
        iteration: DataTypes.INTEGER,
		salt: DataTypes.STRING,
		name: DataTypes.STRING,
		phone:DataTypes.STRING
		
	},{
		instanceMethods: {
			authenticate: function (data) {
				return this.getHash(data) === this.password;
			},
			makeSalt: function () {
				return crypto.randomBytes(16).toString('base64');
			},
			makeIteration: function () {
				return (Math.random()*1000 + 1);
			},
			getHash: function (password) {
				if(!password || !this.salt) return '';
				var salt = new Buffer(this.salt, 'base64');
				return crypto.pbkdf2Sync(password, salt, this.iteration, 64).toString('base64');
			}
		},
		classMethods : {
			associate: function(models) {
				User.hasMany(models.item);
			}
		},
		timestamps: false
	});

	return User;
};