const Joi = require('joi');
const Config = require('../../config.js');

module.exports.options = {
	method: 'POST',
	path: '/api/users/add',
	level: Config.rolesLevel.guest,
	validation : {
		options: {

		},
		schema : {
			email: Joi.string()
				.email()
				.description("Email of the user")
				.required(),
			nickname: Joi.string()
				.min(3).max(30)
				.description("Nickame that will be displayed")
				.required(),
			password: Joi.string()
				.description("Password of the user")
				.required()
		}
	}
};

module.exports.handler = function(request, response) {
	response.send('hello world!');
};