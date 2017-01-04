"use strict";

const Hapi = require('hapi');

const Log = require('src/logger.js');
const Config = require('src/config.js');
const Routes = require('src/api/routes.js');

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
    register: require('src/auth/authStrategy'),
    options: {
        message: 'hello'
    }
}, (err) => {

    if(err) return Log.error("Registration error :", err);

    for(let i in Config.roles) {
        let role = Config.roles[i];
        server.auth.strategy(role.name, 'checkRole', { requiredRoleLevel: role.level });
    }

    server.route({
        path: '/',
        method: 'GET',
        config: {
            auth: Config.roles.member.name
        },
        handler: ( req, reply ) => {
            reply('Hello !');
        }
    });


    server = Routes(server);

    server.start(err => {
        if (err)
            throw err;

        Log.info('Server listening on port 8000');
    });
});