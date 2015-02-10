#!/bin/env node

var mongoose = require('mongoose');
var CronJobs = require(__dirname + '/new-release-checker/cronjob');

//  Set the environment variables we need.
global.nrn = {};
global.nrn.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
global.nrn.port      = process.env.OPENSHIFT_NODEJS_PORT || 8085;
global.nrn.environment = 'remote';

if (typeof global.nrn.ipaddress === "undefined")
{
	//  allows us to run/test the app locally.
	console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
	global.nrn.ipaddress = "127.0.0.1";
	global.nrn.environment = 'local';
}

// DATABASE CONNECTION
if(global.nrn.environment == 'local')
{
	mongoose.connect('mongodb://' + (process.env.OPENSHIFT_MONGODB_DB_HOST || global.nrn.ipaddress) + '/new-release-notifier');
} else
{
	var dbname = process.env.MONGODB_DB || 'new-release-notifier';
	mongoose.connect(process.env.OPENSHIFT_MONGODB_DB_URL + dbname);
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() { console.log('Connected to the database'); });

var cj = new CronJobs();
cj.init();

/**
 *  terminator === the termination handler
 *  Terminate server on receipt of the specified signal.
 *  @param {string} sig  Signal to terminate on.
 */
function terminator(sig)
{
	if (typeof sig === "string")
	{
	   console.log('%s: Received %s - terminating sample app ...', Date(Date.now()), sig);
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
