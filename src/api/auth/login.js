"use strict";

const Joi = require('joi');

const Config = require('src/config.js');
const Log = require('src/logger.js');
const Models = require('src/database/models.js');
const Users = Models.users;
const Sessions = Models.session;

var loginPayloadSchema = {
	username: Joi.string()
		.min(3).max(30)
		.description("Nickame that will be displayed")
		.required(),
	password: Joi.string()
		.description("Password of the user")
		.required()
};

function loginHandler(request, reply) {
	reply('Hello from login');
}

module.exports = {
	method: 'POST',
	path: '/api/login',
	handler: loginHandler,
	config: {
		description: 'Login',
        tags: ['api', 'auth'],
        validate: {
            payload: loginPayloadSchema
        }
	}
};

