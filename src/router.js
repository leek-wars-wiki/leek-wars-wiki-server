const Express = require('express');

// Private properties

var self;
var _router;

// Public methods

function Router() {
	self = this;
	_router = Express.Router();
};

Router.prototype.addRoute = function(option, handler) {
	console.log('Setup route ' + option.method + ' ' + option.path);

};

module.exports = Router;