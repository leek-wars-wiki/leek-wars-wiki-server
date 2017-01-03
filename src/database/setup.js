"use strict";

const Mongoose = require('mongoose');

const Config = require('src/config.js');
const Log = require('src/logger.js');

Mongoose.Promise = global.Promise;
Mongoose.connect(Config.mongoose.connectionString);
var db = Mongoose.connection;

db.on('error', err => {
	Log.error('Connection error: ', err);
});

db.on('connected', () => {
	Log.info('Connected to the database');
});