const Mongoose = require('mongoose');

var usersSchema = Mongoose.Schema({
    email: String,
    userName: String,
    role: String,
    status: String,
});

var User = Mongoose.model('Users', usersSchema);

module.exports = User;