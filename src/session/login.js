const Bcrypt = require('bcrypt');
const Boom = require('boom');

const Users = require('src/database/models.js').users;


module.exports = function(request, username, password, reply) {

	Users.findOne({'username': username}, 'password', function (err, user) {
  		if (err) return handleError(err);
  		
  		if(!user) return reply(Boom.unauthorized('Unknown user'));

  		console.log(user);

  		Bcrypt.compare(password, user.password, function(err, isValid) {
		    if(err) return reply(Boom.internal());

		    if(!isValid) return reply(Boom.unauthorized('Bad password'));
		});
	})
};