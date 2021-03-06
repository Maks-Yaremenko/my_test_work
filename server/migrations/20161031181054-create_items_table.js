'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('items', {
        id: {
            type:           Sequelize.INTEGER,
            allowNull:      false,
            autoIncrement:  true,
            primaryKey:     true,
        },
        title: {
            type:           Sequelize.STRING,
            allowNull:      false
        },
        price: {
            type:           Sequelize.FLOAT,
            allowNull:      false
        },
        image:              Sequelize.STRING,
        userId:{
            type:           Sequelize.INTEGER,
            allowNull:      false,
            references: {
              model:        "users",
              key:          "id"
            },
            onUpdate:       "CASCADE",
            onDelete:       "CASCADE"
        },
        createdAt: {
            allowNull:      false,
            type:           Sequelize.DATE
        }
    });
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('items');
    }
};