const Express = require('express');
const Log = require('./src/logger.js');
const Config = require('./src/config.js');

var app = Express();

app.use(require('./src/api/routes.js'));

app.listen(8888, function() {
  	Log.info('Server listening on port 8888');
});