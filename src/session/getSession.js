const Boom = require('boom');

const Login = require('src/session/login.js');

module.exports = function(request, reply) {
	console.log('GET SESSION');
	console.log('request.state', request.state);
	console.log('request.state.session', request.state.session);
	console.log('request.headers.authorization', request.headers.authorization);

	let auth = request.headers.authorization;

	if(auth) {
		return basicAuth(request, auth, reply);
	}

	return reply.continue();
};


function basicAuth(request, authorization, reply) {
	
	const parts = authorization.split(/\s+/);

    if (parts[0].toLowerCase() !== 'basic') {
        return reply(Boom.unauthorized());
    }

    if (parts.length !== 2) {
        return reply(Boom.badRequest('Bad HTTP authentication header format'));
    }

    const credentialsPart = new Buffer(parts[1], 'base64').toString();
    const sep = credentialsPart.indexOf(':');

    if (sep === -1) {
        return reply(Boom.badRequest('Bad header internal syntax'));
    }

    const username = credentialsPart.slice(0, sep);
    const password = credentialsPart.slice(sep + 1);

    if(!username) {
        return reply(Boom.unauthorized('HTTP authentication header missing username'));
    }

    return Login(request, username, password, reply);
}