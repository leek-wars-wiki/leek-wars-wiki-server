const Joi = require('joi');
const Config = require('../../config.js');

const Users = require('../../database/models.js').users;

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

	let user = new Users(request.payload);

	user.save((err, result) => { 
		if(err) {
			Log.error('Add user error:', err);
		}
		else {
			Log.debug(result);
		}
	});

	reply('ok');
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

