const Express = require('express');

var app = Express();

app.use(require('./src/router.js'));

app.listen(8888, function() {
  	console.log('Server listening on port 8888');
});