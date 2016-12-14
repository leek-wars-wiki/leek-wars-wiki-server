const Joi = require('joi');

var addAPI = {
	method: 'POST',
	path: '/api/users/add'
};

function addHandler(request, response) {
	response.send('hello world');
}

module.exports = function(router) {
	router.addRoute(addAPI, addHandler);
};