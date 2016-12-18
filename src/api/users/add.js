const Joi = require('joi');
const Config = require('../../config.js');

module.exports.options = {
	method: 'POST',
	path: '/api/users/add'
};

module.exports.handler = function(request, response) {
	response.send('hello world!');
};