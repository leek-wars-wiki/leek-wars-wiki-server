"use strict";

const Fs = require('fs');
const Path = require('path');

const Log = require('../logger.js');

const API_PATH = './src/api';

module.exports = function(server) {
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
	return server;
};