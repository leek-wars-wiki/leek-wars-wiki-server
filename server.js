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
	ttl: null,
	path: '/'
});

server.ext( {
    type: 'onPreAuth',
    method: require('src/session/getSession')
});

server.route({
    path: '/',
    method: 'GET',
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