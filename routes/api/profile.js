#!/bin/env node

var express = require('express');
var router = express.Router();
var User = require(__dirname + '/../../db/user.js');

router.get('/api/profile', function(req, res, next)
{
	res.json(req.user);
});

router.post('/api/profile', function(req, res, next)
{
	// convert cron object to string
	req.body.crontime = getCronTimeString(req.body.crontimeObject);

	delete req.body._id;
	User.update({_id:req.user._id}, req.body, function(err)
	{
		if(err)
		{
			console.log('Error updating'); console.log(err);
			res.sendStatus(500);
		} else {
			console.log('User profile updated');

			res.status(200);
			res.json(req.body);
		}
	});
});

router.get('/api/profile/pushbullet/devicelist', function(req, res, next)
{
	if(req.user.notificationproviders)
	{
		if(req.user.notificationproviders.pushbullet)
		{
			if(req.user.notificationproviders.pushbullet.accesstoken)
			{
				var PushBullet = require('pushbullet');
				var pusher = new PushBullet(req.user.notificationproviders.pushbullet.accesstoken);
				pusher.devices(function(error, response) {
				    console.log("Pushbullet device list response");
					console.log(response);
					res.json(response);
				});
			} else {
				res.sendStatus(500);
			}
		} else {
			res.sendStatus(500);
		}
	} else {
		res.sendStatus(500);
	}
});

function getCronTimeString(cronTimeObject)
{
	var crontimeString = "0"; // Seconds
	crontimeString += " " + getCronStringValue(cronTimeObject.minutes, 60);
	crontimeString += " " + getCronStringValue(cronTimeObject.hours, 24);
	crontimeString += " " + getCronStringValue(cronTimeObject.day, 31);
	crontimeString += " " + getCronStringValue(cronTimeObject.month, 12);
	crontimeString += " " + getCronStringValue(cronTimeObject.weekday, 6);
	return crontimeString;
}

function getCronStringValue(number, max)
{
	if(number < 0)
	{
		return "*";
	} else if(number > max)
	{
		return max.toString();
	} else
	{
		return number.toString();
	}
}

module.exports.router = router;
