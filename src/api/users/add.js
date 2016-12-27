"use strict";

const Joi = require('joi');
const Bcrypt = require('bcrypt');
const Boom = require('boom');

const Config = require('src/config.js');
const Log = require('src/logger.js');
const Users = require('src/database/models.js').users;

var addPayloadSchema = {
	email: Joi.string()
		.email()
		.description("Email of the user")
		.required(),
	username: Joi.string()
		.min(3).max(30)
		.description("Nickame that will be displayed")
		.required(),
	password: Joi.string()
		.description("Password of the user")
		.required()
};

function addHandler(request, reply) {
	let user = new Users(request.payload);

	Bcrypt.hash(user.password, Config.saltRounds, (err, hash) => {
		if(err) return reply(Boom.internal());

		user.password = hash;

		user.save((err, result) => { 
			if(err) {
				Log.error('Add user error:', err);
				return reply(Boom.internal());
			}

			reply(request.payload).code(201);
		});
	});
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

