'use strict';

module.exports = function (sequelize, DataTypes) {
	var Item = sequelize.define('item', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {msg: "Title is required"},
				len: {args: [3,16], msg: 'Title must be between 3 and 16 characters in length'}
			}
		},
		price: {
			type: DataTypes.FLOAT,
			allowNull: false,
			validate: {
				notEmpty: {msg: "Price is required"}
			}
		},
		image: DataTypes.STRING,
		userId: DataTypes.INTEGER,
		createdAt: DataTypes.DATE
	},{
		classMethods: {
			associate: function (models) {
				Item.belongsTo(models.user);
			}
		},
		updatedAt: false
	})
	return Item;
}