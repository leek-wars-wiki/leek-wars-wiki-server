"use strict";

const Winston = require('winston');

var logger = new Winston.Logger({
    level: 'info',
    transports: [
	    new (Winston.transports.Console)({
	    	name: 'debug-console',
	    	level: 'debug',
	    	colorize: true,
	    	timestamp: true,
	    	showLevel: true,
	    	prettyPrint: true
	    }),
	    new (Winston.transports.File)({
      		name: 'error-file',
      		filename: 'filelog-error.log',
      		level: 'error',
      		timestamp: true,
      		showLevel: true
    	})
	]
});

module.exports = logger;