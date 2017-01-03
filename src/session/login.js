"use strict";

const Bcrypt = require('bcrypt');
const Boom = require('boom');
const Promise = require('promise');

const Config = require('src/config.js');
const Log = require('src/logger.js');
const Users = require('src/database/models.js').users;


module.exports = function(username, password) {
	return new Promise((fulfill, reject) => {
		// Search user in database
		Users.findOne({'username': username}, 'password role', (err, user) => {
			if(err) reject(Boom.internal("Error while searching user"));

			if(!user) return reject(Boom.unauthorized("Unknown user"));

			// Check user password
			Bcrypt.compare(password, user.password, (err, isValid) => {
			    if(err) reject(Boom.internal("Error while checking user's password"));

			    // Valid password - Return a new session
			    if(isValid) {
			    	Log.verbose("Connection from user : " + username);

			    	fulfill({
			    		username: username,
			    		role: user.role ? user.role : Config.roles.guest
			    	});
			    }
			    else {
			    	reject(Boom.unauthorized("Bad password"));
			    }
			});
		});
	});
};