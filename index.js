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
* Exit server handles exit signals to exit gracefully
**/
var exit = require(__dirname + '/includes/exit-server');
