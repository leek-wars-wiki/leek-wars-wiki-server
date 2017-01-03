"use strict";

const Boom = require('boom');

const Config = require('src/config.js');
const Log = require('src/logger.js');
const Login = require('src/session/login.js');
const Sessions = require('src/database/models.js').Sessions;

module.exports = function(request, reply) {
	Log.debug('GET SESSION');
	Log.debug('request.state', request.state);
	Log.debug('request.state.session', request.state.session);
	Log.debug('request.headers.authorization', request.headers.authorization);

	let authHeader = request.headers.authorization;
    let token = request.state.session;

	if(authHeader) {
        // Basic authentification
        if(authHeader.startsWith('Basic')) {
            basicAuth(authHeader)
                .then(result => {
                    getSession({
                            newConnection: true,
                            username: result.username,
                            role: result.role
                        })
                        .then(session => { Log.debug('Session', session); })
                        .catch(err => { Log.debug('Session error', err); });


                    reply.continue();
                })
                .catch(err => {
                    reply(err);
                });

        // Cookie authentification (Header)
        } else if(authHeader.startsWith('Cookie')) {
            token = authHeader.split(/\s+/)[1];
        }
	} else if(token) {
        getSession({
                newConnection: false,
                token: token
            })
            .then(session => { Log.debug('Session', session); })
            .catch(err => { Log.debug('Session error', err); });

        reply.continue();
        
    } else {
        request.session = {};
        reply.continue();
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
            .catch(err => {
                reject(err);
            });
    });
}

function getSession(options) {
    return new Promise((fulfill, reject) => {
        if(options.newConnection) {
            Sessions.remove({
                    'username': options.username
                })
                .then(() => {
                    Sessions.create({
                            username: options.username,
                            role: options.role,
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

        } else {
            Sessions.findOne({
                    '_id': options.token
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
                    Log.error('Create session error :', err);
                    reject(err);
                });
        }
    });
}