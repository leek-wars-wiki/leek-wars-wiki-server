const Joi = require('joi');

module.exports.options = {
	method: 'POST',
	path: '/api/users/add'
};

module.exports.handler = function(request, response) {
	response.send('hello world!');
};