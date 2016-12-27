"use strict";

const Mongoose = require('mongoose');

var sessionsSchema = Mongoose.Schema({
    token: String,
    username: String,
    role: String,
    isAuth: Boolean,
    keep: Boolean
});

module.exports = Mongoose.model('Sessions', sessionsSchema);
