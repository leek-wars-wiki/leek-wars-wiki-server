"use strict";

const Fs = require('fs');
const Path = require('path');

const Log = require('../logger.js');

const API_PATH = './src/api';

module.exports.register = function (server, options, next) {
	Fs.readdirSync(API_PATH)
	.filter(file => {
		return Fs.statSync(Path.join(API_PATH, file)).isDirectory();
	})
	.forEach(dir => {
		Fs.readdirSync(Path.join(API_PATH, dir))
			.filter(file => {
				return Path.extname(file) === '.js';
			})
			.forEach(apiFile => {
				let api = require('./' + Path.join(dir, apiFile));

				Log.verbose('New route : [' + api.method + '] ' + api.path);

				server.route(api);
			});
	});

	Log.info('Routes creation : Completed');

	// Temporary
	server.route({
        path: '/',
        method: 'GET',
        config: {
            auth: require('src/config.js').roles.guest.name
        },
        handler: (request, reply) => {
            reply(request.auth.credentials).code(200);
        }
    });

	next();
};

module.exports.register.attributes = {
	name: 'setupRoutes',
	version: '1.0.0'
};