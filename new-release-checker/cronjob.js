#!/bin/env node

module.exports = function()
{
	var scope = this;

	this.CronJob = require('cron').CronJob;
	this.NewReleases = require(__dirname + '/new-release-checker');
	this.User = require(__dirname + '/../db/user');
	this.masterCronJob = undefined;
	this.runningJobs = [];
	this.runningJobsSettings = {};

	this.init = function()
	{
		scope.masterCronJob = new scope.CronJob(
		{
			cronTime: '00 * * * * *',
			onTick: scope.addNewCronJobs,
			start: true,
			timeZone: 'Europe/Amsterdam'
		});
		scope.addNewCronJobs();
	};

	this.addNewCronJobs = function()
	{
		scope.User.find({active:true}).select({crontime: 1, timezone: 1, _id:0}).lean(true).exec(function(err, cronJobs)
		{
			// ADD NEW CRONJOBS
			cronJobs.forEach(function(job)
			{
				if(typeof scope.runningJobsSettings[job.timezone] === 'undefined') { scope.runningJobsSettings[job.timezone] = []; } // Init array
				if(scope.runningJobsSettings[job.timezone].indexOf(job.crontime) === -1)
				{
					scope.runningJobs.push
					(
						new scope.CronJob(
						{
							cronTime: job.crontime,
							onTick: scope.runCheck,
							start: true,
							timeZone: job.timezone
						})
					);
					console.log("CRONJOB ADDED> Time: %s, Zone: %s", job.crontime, job.timezone);
					scope.runningJobsSettings[job.timezone].push(job.crontime);
				}
			});

			// SEARCH FOR REDUNDANT CRONJOBS
			for(var r = scope.runningJobs.length-1; r >= 0 ; r--)
			{
				var runningJob = scope.runningJobs[r];
				var redundant = true;
				for(var c = 0; c < cronJobs.length; c++)
				{
					if(cronJobs[c].crontime == runningJob.cronTime && cronJobs[c].timezone == runningJob.cronTime.zone)
					{
						redundant = false;
						break;
					}
				}
				if(redundant)
				{
					console.log("CRONJOB REMOVED> Time: %s, Zone: %s", runningJob.cronTime, runningJob.cronTime.zone);
					runningJob.stop();
					scope.runningJobs.splice(r, 1);
				}
			}
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
