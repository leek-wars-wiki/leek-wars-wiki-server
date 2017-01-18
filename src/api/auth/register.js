"use strict";

const Joi = require('joi');

const Config = require('src/config.js');
const Log = require('src/logger.js');
const Login = require('src/auth/login.js');
const SessionsHandler = require('src/auth/sessionsHandler');

var registerPayloadSchema = {
	email: Joi.string()
		.email()
		.description("Your contact email address")
		.required(),
	username: Joi.string()
		.min(3).max(30)
		.description("Nickame that will be displayed")
		.required(),
	password: Joi.string()
		.description("Password of the user")
		.required()
};

function registerHandler(request, reply) {
	Log.debug(request.payload);
	reply();
}

module.exports = {
	method: 'POST',
	path: '/register',
	handler: registerHandler,
	config: {
		description: 'Register',
        tags: ['api', 'auth', 'register'],
        validate: {
            payload: registerPayloadSchema
        }
	}
};

