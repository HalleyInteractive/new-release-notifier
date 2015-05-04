#!/bin/env node

var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require(__dirname + '/../db/user.js');

router.get('/auth/google', passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/userinfo.email'}));
router.get('/auth/google/callback', passport.authenticate('google', { successRedirect:'/login/success', failureRedirect: '/login' }));
router.get('/login', function(req, res) { res.render('login'); });
router.get('/login/success', function(req, res)
{
	var redirect_to = req.session.redirect_to ? req.session.redirect_to : '/profile';
	delete req.session.redirect_to;
	res.redirect(redirect_to);
});

var googleStrategySettings = {};
if(global.nrn.environment == 'local')
{
	var SecretSettingsFile = require(__dirname + '/../secrets.json');
	googleStrategySettings.client_id = SecretSettingsFile.auth.google.client_id;
	googleStrategySettings.client_secret = SecretSettingsFile.auth.google.client_secret;
	googleStrategySettings.callbackURL = 'http://' + global.nrn.ipaddress + ':' + global.nrn.port + '/auth/google/callback';
} else
{
	googleStrategySettings.client_id = process.env.GOOGLE_CLIENT_ID;
	googleStrategySettings.client_secret = process.env.GOOGLE_CLIENT_SECRET;
	googleStrategySettings.callbackURL = 'http://'+process.env.APP_URL+'/auth/google/callback';
}

/**
* GOOGLE STRATEGY
**/
passport.use(new GoogleStrategy
(
	{
		clientID: googleStrategySettings.client_id,
		clientSecret: googleStrategySettings.client_secret,
		callbackURL: googleStrategySettings.callbackURL
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
