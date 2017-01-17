"use strict";

const Boom = require('boom');

const Config = require('src/config.js');
const Log = require('src/logger.js');
const Sessions = require('src/database/models.js').Sessions;

var SessionsHandler = {};

SessionsHandler.newSession = function(username, role, keep) {
	return new Promise((fulfill, reject) => {
		Sessions.remove({
				'username': username
			})
			.then(() => {
				Sessions.create({
						username: username,
						role: role,
						isAuth: true,
						keep: keep
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
};

SessionsHandler.getSession = function(token) {
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
};

SessionsHandler.checkRole = function(userRole, requiredRoleLevel) {
	return new Promise((fulfill, reject) => {
		let userRoleLevel = Config.roles[userRole].level;

		if(!userRoleLevel) return reject(Boom.unauthorized("No session role"));

		if(requiredRoleLevel > userRoleLevel) return reject(Boom.unauthorized("Insufficient permissions"));

		fulfill();
	});
};

SessionsHandler.getGuestSession = function() {
	return {
		role: Config.roles.guest.name,
		isAuth: false,
		keep: false
	};
};

module.exports = SessionsHandler;