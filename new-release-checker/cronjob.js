#!/bin/env node

module.exports = function()
{
	var scope = this;

	this.CronJob = require('cron').CronJob;
	this.NewReleases = require(__dirname + '/new-release-checker');
	this.User = require(__dirname + '/../db/user');
	this.jobs = [];

	this.init = function()
	{
		// TODO: Distinct cron time and time zone
		scope.User.find({active:true}).distinct('crontime', function(err, cronTimes)
		{
			cronTimes.forEach(function(cronTime)
			{
				scope.jobs.push
				(
					new scope.CronJob(
					{
						cronTime: cronTime,
						onTick: scope.runCheck,
						start: true,
						timeZone: "Europe/Amsterdam"
					})
				);
			});
		});
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
