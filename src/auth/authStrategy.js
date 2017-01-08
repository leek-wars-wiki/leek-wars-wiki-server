"use strict";

const Boom = require('boom');

const Config = require('src/config');
const Log = require('src/logger');

const SessionsHandler = require('src/auth/sessionsHandler');
const BasicAuth = require('src/auth/basicAuth');


module.exports.register = function (server, options, next) {
	server.auth.scheme('checkRole', roleScheme);

	next();
};

module.exports.register.attributes = {
	name: 'roleAuthStrategy',
	version: '1.0.0'
};

function roleScheme(server, options) {
	return {
		authenticate: function (request, reply) {

			Log.debug('GET SESSION');
			Log.debug('request.state', request.state);
			Log.debug('request.state.session', request.state.session);
			Log.debug('request.headers.authorization', request.headers.authorization);

			let authHeader = request.headers.authorization;
			let token = request.state.session;

			if(authHeader) {
				// Basic authentification
				if(authHeader.startsWith('Basic')) {
					BasicAuth(authHeader)
						.then(user => {
							SessionsHandler.newSession(user.username, user.role, false)
								.then(session => {
									SessionsHandler.checkRole(session.role, options.requiredRoleLevel)
										.then(() => {
											//reply.state('session', session._id);
											reply.continue({ credentials: session });
										})
										.catch(err => { reply(err); });
								})
								.catch(err => { reply(err); });
						})
						.catch(err => { reply(err); });

					return;

				// Cookie authentification (Header)
				} else if(authHeader.startsWith('Cookie')) {
					token = authHeader.split(/\s+/)[1];
				}
			} 

			if(token) {
				SessionsHandler.getSession(token)
					.then(session => { Log.debug('Session', session); })
					.catch(err => { Log.debug('Session error', err); });
				return;
			}

			reply.continue({ credentials: SessionsHandler.getGuestSession() });
		}
	};
};