#!/bin/env node

/**
* Sets up default settings that can be access globally
**/
var settings = require(__dirname + '/includes/settings.js');
settings.base = __dirname;

/**
* Set up connection to the database
**/
var mongoose = require('mongoose');
mongoose.connect(global.nrn.mongoConnectionString);
mongoose.connection.on('error', console.error.bind(console, 'Database connection error:'));
mongoose.connection.once('open', function callback() { console.log('Connected to the database'); });
global.nrn.mongoose = mongoose;

/**
* CronJobs handles checking new releases and notifying users
**/
var Cronjob = require(__dirname + '/new-release-checker/cronjob');
var cronjob = new Cronjob();
cronjob.init();

/**
* Front end for the user is provided with express.
* Also the API from the front end to the database.
**/
var express = require(__dirname + '/includes/express-server');
var http = require('http').Server(express);
http.listen(global.nrn.port, global.nrn.ipaddress, function()
{
	console.log('%s: New Release Notifier server started on %s:%d ...', Date(Date.now() ), global.nrn.ipaddress, global.nrn.port);
});

/**
 *  terminator === the termination handler
 *  Terminate server on receipt of the specified signal.
 *  @param {string} sig  Signal to terminate on.
 */
function terminator(sig)
{
	if (typeof sig === "string")
	{
	   console.log('%s: Received %s - terminating New Release Notifier', Date(Date.now()), sig);
	   process.exit(1);
	}
	console.log('%s: Node server stopped.', Date(Date.now()) );
}

// Process on exit and signals.
process.on('exit', function(){ terminator(); });

// Removed 'SIGPIPE' from the list - bugz 852598.
['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach(function(element)
{
	process.on(element, function() { terminator(element); });
});
