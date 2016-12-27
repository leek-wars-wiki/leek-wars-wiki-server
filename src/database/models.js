"use strict";

const Fs = require('fs');
const Path = require('path');

const MODELS_PATH = 'src/database/models';

var Models = {};

Fs.readdirSync(MODELS_PATH)
	.filter(entry => {
		return Fs.statSync(Path.join(MODELS_PATH, entry)).isFile();
	})
	.forEach(file => {
		Models[Path.basename(file, '.js')] = require('./models/' + file);
	});

module.exports = Models;