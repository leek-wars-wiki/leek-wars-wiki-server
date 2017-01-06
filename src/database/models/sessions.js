"use strict";

const Mongoose = require('mongoose');

var sessionsSchema = Mongoose.Schema({
    username: String,
    role: String,
    isAuth: Boolean,
    keep: Boolean,
    updatedAt: Date,
    createdAt: Date
});

module.exports = {
	name: 'Sessions',
	model: Mongoose.model('Sessions', sessionsSchema)
};