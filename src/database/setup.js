"use strict";

const Mongoose = require('mongoose');

const Log = require('src/logger.js');

Mongoose.connect('mongodb://localhost/wikidb');
var db = Mongoose.connection;

db.on('error', err => {
	Log.error('Connection error: ', err);
});

db.on('connected', () => {
	Log.info('Connected to the database');
});