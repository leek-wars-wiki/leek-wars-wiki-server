"use strict";

const Fs = require('fs');
const Path = require('path');
const Handlebars = require('handlebars');

const Log = require('../logger.js');

const VIEWS_PATH = "src/views/html";

module.exports.register = function (server, options, next) {
	server.views({
        engines: {
            html: Handlebars
        },
        relativeTo: VIEWS_PATH,
        path: 'index'
    });

	next();
};

module.exports.register.attributes = {
	name: 'setupViews',
	version: '1.0.0'
};