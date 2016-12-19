const Hapi = require('hapi');

const Log = require('./src/logger.js');
const Config = require('./src/config.js');
const Routes = require('./src/api/routes.js');

var server = new Hapi.Server();

server.connection({
	host: 'localhost',
	port: 8000
});

server = Routes(server);

server.start(err => {
    if (err)
    	throw err;
    
    Log.info('Server listening on port 8000');
});