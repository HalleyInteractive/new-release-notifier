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

module.exports.router = router;
