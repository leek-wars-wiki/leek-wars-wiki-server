"use strict";

const Boom = require('boom');

const Config = require('src/config.js');
const Log = require('src/logger.js');
const Login = require('src/auth/login.js');

module.exports = function(authorization) {
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
            .then(user => {
                fulfill(user);
            })
            .catch(err => {
                reject(err);
            });
    });
}