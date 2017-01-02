"use strict";

const Boom = require('boom');

const Log = require('src/logger.js');
const Login = require('src/session/login.js');

module.exports = function(request, reply) {
	console.log('GET SESSION');
	console.log('request.state', request.state);
	console.log('request.state.session', request.state.session);
	console.log('request.headers.authorization', request.headers.authorization);

	let authHeader = request.headers.authorization;
    let cookie = request.state.session;

	if(authHeader) {
        // Basic authentification
        if(authHeader.startsWith('Basic')) {
            basicAuth(authHeader)
                .then(session => {
                    Log.debug(session);
                    return reply.continue();
                })
                .catch(err => {
                    return reply(err);
                });

        // Cookie authentification (Header)
        } else if(authHeader.startsWith('Cookie')) {
            cookie = authHeader.split(/\s+/)[1];
        }
	}

    if(cookie) {
        //@TODO
        
    } else {
        request.session = {};
        return reply.continue();
    }
};

function basicAuth(authorization) {
    return new Promise((fulfill, reject) => {
        const parts = authorization.split(/\s+/);

        if (parts[0].toLowerCase() !== 'basic') {
            reject(Boom.unauthorized("Not a basic authentification"));
        }

        if (parts.length !== 2) {
            reject(Boom.badRequest("Bad HTTP authentication header format"));
        }

        const credentialsPart = new Buffer(parts[1], 'base64').toString();
        const sep = credentialsPart.indexOf(':');

        if (sep === -1) {
            reject(Boom.badRequest('Bad header internal syntax'));
        }

        const username = credentialsPart.slice(0, sep);
        const password = credentialsPart.slice(sep + 1);

        if(!username) {
            reject(Boom.unauthorized("HTTP authentication header missing username"));
        }

        Login(username, password)
            .then(session => {
                fulfill(session);
            })
            .catch(reject);
    });
}