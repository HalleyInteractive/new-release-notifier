#!/bin/env node

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/api/profile', function(req, res, next)
{
	res.json(req.user);
});

module.exports.router = router;
