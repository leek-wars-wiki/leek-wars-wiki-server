"use strict";

const Joi = require('joi');

const Config = require('src/config.js');
const Log = require('src/logger.js');
const Login = require('src/auth/login.js');
const SessionsHandler = require('src/auth/sessionsHandler');

var loginPayloadSchema = {
	username: Joi.string()
		.min(3).max(30)
		.description("Nickame that will be displayed")
		.required(),
	password: Joi.string()
		.description("Password of the user")
		.required(),
	keep: Joi.boolean()
		.description("Keep the session")
		.default(false)
};

function loginHandler(request, reply) {
	let loginFields = request.payload;
	Log.debug(request.payload);

	Login(loginFields.username, loginFields.password)
        .then(user => {
            SessionsHandler.newSession(user.name, user.role, loginFields.keep)
            	.then(session => { 
            		reply(session).state('session', session._id);
            	})
            	.catch(reply);
        })
        .catch(reply);
}

module.exports = {
	method: 'POST',
	path: '/login',
	handler: loginHandler,
	config: {
		description: 'Login',
        tags: ['api', 'auth'],
        validate: {
            payload: loginPayloadSchema
        }
	}
};

