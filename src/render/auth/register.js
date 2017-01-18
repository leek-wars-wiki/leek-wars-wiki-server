"use strict";

const Joi = require('joi');

const Config = require('src/config.js');
const Log = require('src/logger.js');

function registerHandler(request, reply) {
	reply.view('auth/register', {
        message: 'Hello World!'
    });
}

module.exports = {
	method: 'GET',
	path: '/register',
	handler: registerHandler,
	config: {
		description: 'Index',
        tags: ['index']
	}
};