"use strict";

const Boom = require('boom');

const Config = require('src/config.js');
const Log = require('src/logger.js');

const BasicAuth = require('src/auth/basicAuth.js');
const Sessions = require('src/database/models.js').Sessions;


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
						.then(result => {
							newSession(result.username, result.role)
								.then(session => {
									checkRole(session.role, options.requiredRoleLevel)
										.then(() => {
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
				getSession(token)
					.then(session => { Log.debug('Session', session); })
					.catch(err => { Log.debug('Session error', err); });
			}

			reply.continue();
		}
	};
};

function newSession(username, role) {
	return new Promise((fulfill, reject) => {
		Sessions.remove({
				'username': username
			})
			.then(() => {
				Sessions.create({
						username: username,
						role: role,
						isAuth: true,
						keep: false
					})
					.then(session => {
						fulfill(session);
					})
					.catch(err => {
						Log.error('Create session error :', err);
						reject(err);
					});
			})
			.catch(err => {
				reject(err);
			});
	});
}

function getSession(token) {
	return new Promise((fulfill, reject) => {
		Sessions.findOne({
				'_id': token
			})
			.then(session => {
				if(!session) {
					fulfill({
						role: Config.roles.guest,
						isAuth: false,
						keep: false
					});
				} else {
					fulfill(session);
				}
			})
			.catch(err => {
				Log.error('Retrieve session error :', err);
				reject(err);
			});
	});
}

function checkRole(userRole, requiredRoleLevel) {
	return new Promise((fulfill, reject) => {
		let userRoleLevel = Config.roles[userRole].level;

		if(!userRoleLevel) return reject(Boom.unauthorized("No session role"));

		if(requiredRoleLevel > userRoleLevel) return reject(Boom.unauthorized("Insufficient permissions"));

		fulfill();
	});
}