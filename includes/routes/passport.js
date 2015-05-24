#!/bin/env node

var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require(global.nrn.base + '/db/user.js');

/**
* AUTH ROUTES
**/
router.get('/auth/google', passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/userinfo.email'}));
router.get('/auth/google/callback', passport.authenticate('google', { successRedirect:'/login/success', failureRedirect: '/login' }));
router.get('/login/success', function(req, res)
{
	var redirect_to = req.session.redirect_to ? req.session.redirect_to : '/profile';
	delete req.session.redirect_to;
	res.redirect(redirect_to);
});

router.get('/auth/logout', function(req, res)
{
  req.logout();
  res.status(200).end();
});

/**
* GOOGLE STRATEGY
**/
passport.use(new GoogleStrategy
(
	{
		clientID: global.nrn.strategy.google.client_id,
		clientSecret: global.nrn.strategy.google.client_secret,
		callbackURL: global.nrn.strategy.google.callbackURL
	},
	function(accessToken, refreshToken, profile, done)
	{
		User.findOrCreate(
		{
			auth:
			{
				provider: 'google',
				id: profile.id
			}
		},
		{
			email: profile.emails[0].value,
			username: profile.displayName,
			name:
			{
				first: profile.name.givenName,
				last: profile.name.familyName
			},
			gender: profile._json.gender,
			picture: profile._json.picture
		}, function ()
		{
			process.nextTick(function()
			{
				return done(null, profile);
			});
		});
	}
));

/**
* SERIALIZING FUNCTIONS
**/
passport.serializeUser(function(user, done)
{
	User.findOne({'auth.provider': user.provider, 'auth.id': user.id.toString()}, function(err, dbUser)
	{
		if(err) { console.warn(err); }
		done(null, dbUser);
	});
});

passport.deserializeUser(function(obj, done) {
	User.findOne({_id:obj._id}, function (err, user) {
		done(err, user);
	});
});


module.exports.router = router;
module.exports.passport = passport;
