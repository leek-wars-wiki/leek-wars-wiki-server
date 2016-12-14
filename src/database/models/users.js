const Mongoose = require('mongoose');
const Joi = require('joi');

var usersSchema = Mongoose.Schema({
    email: String,
    userName: String,
    role: String,
    status: String,
});

module.exports = Mongoose.model('Users', usersSchema);
