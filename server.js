const Express = require('express');

const DbSetup = require('./src/database/setup.js');

var app = Express();

app.get('/', function (req, res) {
  	res.send('Hello World!');
})

app.listen(8888, function() {
  	console.log('Server listening on port 8888');
})