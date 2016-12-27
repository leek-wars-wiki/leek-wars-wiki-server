"use strict";

const Mongoose = require('mongoose');

var usersSchema = Mongoose.Schema({
    email: String,
    username: String,
    password: String,
    role: String,
    status: String,
});

module.exports = Mongoose.model('Users', usersSchema);
