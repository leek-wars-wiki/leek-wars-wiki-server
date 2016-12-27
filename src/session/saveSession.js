"use strict";

module.exports = function(request, reply) {
	console.log('SAVE SESSION');
	console.log('request.state.session', request.state.session);
	console.log('request.headers.authorization', request.headers.authorization);
	 


	return reply.continue();
};