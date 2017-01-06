"use strict";

const Mongoose = require('mongoose');

var usersSchema = Mongoose.Schema({
    email: String,
    username: String,
    password: String,
    role: String,
    status: String,
    updatedAt: Date,
    createdAt: Date
});

module.exports = {
	name: 'Users',
	model: Mongoose.model('Users', usersSchema)
};