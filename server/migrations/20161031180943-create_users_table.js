'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) {

	return queryInterface.createTable('users', { 
		id: {
			allowNull:      false,
			autoIncrement:  true,
			primaryKey:     true,
			type:           Sequelize.INTEGER
		},
		name:               Sequelize.STRING,
		email: {
			type:           Sequelize.STRING,
			allowNull:      false
		},
		password: {
			type:           Sequelize.STRING,
			allowNull:      false
		},
		iteration:          Sequelize.INTEGER,
		phone:              Sequelize.STRING,
		salt:               Sequelize.STRING
		});
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.dropTable('users');
  }
};
