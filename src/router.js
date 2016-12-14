const Express = require('express');

// Private properties

var self;
var _router;

// Public methods

function Router() {
	self = this;
	_router = Express.Router();
};



module.exports = Router;