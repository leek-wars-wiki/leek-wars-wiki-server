const Fs = require('fs');
const Path = require('path');
const Express = require('express');

const Log = require('../logger.js');

const API_PATH = './src/api';

var Router = Express.Router();

function addRoute(api) {
	Log.verbose('New route : [' + api.options.method + '] ' + api.options.path);

	switch(api.options.method) {
		case 'GET':
			Router.get(api.options.path, api.handler);
			break;
		case 'POST':
			Router.post(api.options.path, api.handler);
			break;
	};
};

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
				addRoute(require('./' + Path.join(dir, apiFile)));
			});
	});

Log.info('Routes creation : Completed');
module.exports = Router;