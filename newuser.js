#!/bin/env node

var mongoose = require('mongoose');
var User = require(__dirname + '/db/user.js');

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

var user =
{
	username: "NielsOverwijn",
	name:
	{
		first: "Niels",
		last: "Overwijn"
	},
	email: "niels.overwijn@gmail.com",
	dates:
	{
		created: "20152801",
		loggedin: "20152801"
	},
	auth:
	{
		provider: "google",
		id: ""
	},
	picture: "null",
	gender: "male",
	providers:
	{
		lastfm:
		{
			username: "NielsOverwijn",
			apikey: "166312dfa584982badd5f5c686544966"
		}
	},
	notificationproviders:
	{
		pushbullet:
		{
			accesstoken: "Rsj6eO1ni2FXIlVM9Y7u9gf6iQJ7unic",
			deviceidentifier: "udfgfsjAvIDnCpRk"
		}
	}
};

User.findOrCreate(user, function(err, user, created)
{
	if(err) { console.log("Error: " + err); }
	if(created)
	{
		console.log("New User");
	} else
	{
		console.log("Existing user");
	}
});
