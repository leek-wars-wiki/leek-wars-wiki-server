"use strict";

const Fs = require('fs');
const Path = require('path');
const Handlebars = require('handlebars');

const Log = require('src/logger');

const ROUTES_PATH = './src/routes';
const ROUTES_REQUIRE_PATH = 'src/routes';
const VIEWS_PATH = './src/views/html';

module.exports.register = function (server, options, next) {
	server.views({
        engines: {
            html: Handlebars
        },
        path: VIEWS_PATH
    });

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
					let route = require(Path.join(ROUTES_REQUIRE_PATH ,dir, routeFile));

					Log.verbose('New route : [' + route.method + '] ' + route.path);

					server.route(route);
				});
		});

	Log.info('Routes creation completed');

	next();
};

module.exports.register.attributes = {
	name: 'setupRoutes',
	version: '1.0.0'
};