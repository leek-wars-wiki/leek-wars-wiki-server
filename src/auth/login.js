"use strict";

const Bcrypt = require('bcrypt');
const Boom = require('boom');

const Config = require('src/config.js');
const Log = require('src/logger.js');
const Users = require('src/database/models.js').Users;


module.exports = function(username, password) {
	return new Promise((fulfill, reject) => {
		// Search user in database

		Users.findOne({
				'username': username
			},
				'password role'
			)
			.then(user => {
				if(!user) return reject(Boom.unauthorized("Unknown user"));

				// Check user password
				Bcrypt.compare(password, user.password, (err, isValid) => {
				    if(err) reject(Boom.internal("Error while checking user's password"));

				    // Valid password
				    if(isValid) {
				    	Log.verbose("Connection from user : " + username);

				    	fulfill({
				    		username: username,
				    		role: user.role ? user.role : Config.roles.guest.name
				    	});
				    }
				    else {
				    	reject(Boom.unauthorized("Bad password"));
				    }
				});
			})
			.catch(err => {
				reject(Boom.internal(err));
			});
	});
};