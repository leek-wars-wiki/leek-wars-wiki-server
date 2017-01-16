"use strict";

const Joi = require('joi');

const Config = require('src/config.js');
const Log = require('src/logger.js');

function loginHandler(request, reply) {
	reply.view('auth/login', {
        message: 'Hello World!'
    });
}

module.exports = {
	method: 'GET',
	path: '/login',
	handler: loginHandler,
	config: {
		description: 'Index',
        tags: ['index']
	}
};