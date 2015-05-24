#!/bin/env node

module.exports = function()
{
	var scope = this;

	this.queryString = require('query-string');
	this.request = require('request');
	this.endpoint = 'http://ws.audioscrobbler.com/2.0/';

	this.getNewReleases = function (user, callback)
	{
		var lastfmApiKey = '';
		if(global.nrn.environment == 'local')
		{
			var SecretSettingsFile = require(__dirname + '/../../secrets.json');
			lastfmApiKey = SecretSettingsFile.auth.lastfm.api_key;
		} else {
			lastfmApiKey = process.env.LASTFM_API_KEY;
		}
		
		var URLQuery = scope.queryString.stringify(
		{
			method: 'user.getnewreleases',
			user: user.providers.lastfm.username,
			api_key: lastfmApiKey,//user.providers.lastfm.apikey,
			format: 'json'
		});
		scope.request.get({url:scope.endpoint + '?' + URLQuery, json:true}, callback);
	};
};
