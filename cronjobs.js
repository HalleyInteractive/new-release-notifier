#!/bin/env node

module.exports = function()
{
	var scope = this;

	this.CronJob = require('cron').CronJob;
	this.NewReleases = require(__dirname + '/newreleases');
	this.User = require(__dirname + '/db/user');
	this.jobs = [];

	this.init = function()
	{
		// TODO: select distinct crontime and timezone from database users
		scope.jobs.push(
			new scope.CronJob(
			{
				cronTime: '* 00 11 * * *',
				onTick: scope.runCheck,
				start: true,
				timeZone: "Europe/Amsterdam"
			})
		);
	};

	this.runCheck = function()
	{
		console.log(this.cronTime.source);
		console.log(this.cronTime.zone);
		scope.User.find({active:true, crontime: this.cronTime.source, timezone: this.cronTime.zone}, function(err, users)
		{
			if(err) { console.log('Error getting users from the database: '+ err); }
			users.forEach(function(user)
			{
				var releases = new scope.NewReleases();
				releases.checkNewReleases(user);
			});
		});
	};
};
