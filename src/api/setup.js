const Fs = require('fs');
const Path = require('path');

const Router = require('./src/router.js');

const API_PATH = './src/api';

Fs.readdirSync(API_PATH)
	.filter(file => {
		return Fs.statSync(Path.join(API_PATH, file)).isDirectory();
	})
	.forEach(dir => {
		console.log(dir);
	});