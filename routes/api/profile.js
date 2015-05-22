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

module.exports.router = router;
