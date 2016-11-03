'use strict';

var authenticate = require(process.cwd() + '/server/api/authenticate/authenticate');

module.exports = function (app) {
	app.use('/api/login', authenticate.login);
	app.use('/api/register', authenticate.register);
	app.use('/api/me', require('./api/me'));
	app.use('/api/user', require('./api/user'));
	app.use('/api/item', require('./api/item'));
}

