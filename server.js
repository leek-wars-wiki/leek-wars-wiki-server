"use strict";

const Hapi = require('hapi');

const Log = require('src/logger.js');
const Config = require('src/config.js');

const AuthStrategy = require('src/auth/authStrategy');
const Routes = require('src/api/routes');

// Setup DB
require('./src/database/setup.js');

var server = new Hapi.Server();

server.connection({
	host: 'localhost',
	port: 8000
});

server.state( 'session', {
    isSecure: process.env.WIKI_DEV_ENV ? false : true,
    ttl: null,
    encoding: 'base64json'
});

server.register({
    register: AuthStrategy
}, err => {

    if(err) return Log.error("Registration error :", err);

    for(let i in Config.roles) {
        let role = Config.roles[i];
        server.auth.strategy(role.name, 'checkRole', { requiredRoleLevel: role.level });
    }

    server.register({
        register: Routes
    }, err => {
        server.start(err => {
            if (err)
                throw err;

            Log.info('Server listening on port 8000');
        });
    })
});