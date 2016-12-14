const Express = require('express');
const SetupAPI = require('./src/api/setupAPI.js');

var app = Express();

SetupAPI(app);

app.listen(8888, function() {
  	console.log('Server listening on port 8888');
});