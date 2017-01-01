"use strict";

const Bcrypt = require('bcrypt');
const Boom = require('boom');
const Promise = require('promise');

const Log = require('src/logger.js');
const Users = require('src/database/models.js').users;


module.exports = function(username, password) {
	return new Promise((fulfill, reject) => {
		// Search user in database
		Users.findOne({'username': username}, 'password', (err, user) => {
			if(err) reject(Boom.internal("Error while searching user"));

			if(!user) reject(Boom.unauthorized("Unknown user"));

			// Check user password
			Bcrypt.compare(password, user.password, (err, isValid) => {
			    if(err) reject(Boom.internal("Error while checking user's password"));

			    // Valid password - Return a new session
			    if(isValid) {
			    	Log.verbose("Connection from user : " + username);
			    	fulfill({
			    		isAuthenticated: true,
	                    username: username
			    	});
			    }
			    else {
			    	reject(Boom.unauthorized("Bad password"));
			    }
			});
		});
	});
};