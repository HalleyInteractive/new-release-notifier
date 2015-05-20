#!/bin/env node

var express = require('express');
var router = express.Router();

router.get('/api/profile', function(req, res, next)
{
	res.json(req.user);
});

module.exports.router = router;
