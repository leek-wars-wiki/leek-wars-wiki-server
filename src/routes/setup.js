"use strict";

const Fs = require('fs');
const Path = require('path');

const Log = require('../logger.js');

const ROUTES_PATH = './src/routes';

module.exports.register = function (server, options, next) {
	Fs.readdirSync(ROUTES_PATH)
	.filter(file => {
		return Fs.statSync(Path.join(ROUTES_PATH, file)).isDirectory();
	})
	.forEach(dir => {
		Fs.readdirSync(Path.join(ROUTES_PATH, dir))
			.filter(file => {
				return Path.extname(file) === '.js';
			})
			.forEach(routeFile => {
				let route = require('./' + Path.join(dir, routeFile));

				Log.verbose('New route : [' + route.method + '] ' + route.path);

				server.route(route);
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