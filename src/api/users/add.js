const Joi = require('joi');
const Config = require('../../config.js');

const Log = require('../../logger.js');

var addPayloadSchema = {
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
};

function addHandler(request, reply) {
	Log.debug(request.payload);
	reply('hello world!');
}

module.exports = {
	method: 'POST',
	path: '/api/users/add',
	handler: addHandler,
	config: {
		description: 'Create a new user',
        tags: ['api', 'users'],
        validate: {
            payload: addPayloadSchema
        }
	}
};

