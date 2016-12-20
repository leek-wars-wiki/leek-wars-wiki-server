const Mongoose = require('mongoose');
const Joi = require('joi');

var usersSchema = Mongoose.Schema({
    email: String,
    nickname: String,
    password: String,
    role: String,
    status: String,
});

module.exports = Mongoose.model('Users', usersSchema);
