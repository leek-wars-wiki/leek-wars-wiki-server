const Mongoose = require('mongoose');

Mongoose.connect('mongodb://localhost/wikidb');

var db = Mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error: '));



var User = require('./schemas/users.js');

db.once('open', () => {
	console.log('Connected to db !');

	let u = new User({
	    email: 'test@test.test',
	    userName: 'test',
	    role: 'testor',
	    status: 'new',
	});

	u.save((err, result) => { 
		if(err) return console.log(err);
		console.log(result);
	});

});