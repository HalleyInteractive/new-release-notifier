#!/bin/env node

module.exports = function()
{
	var scope = this;
	this.Album = require(__dirname + '/db/album.js');
	this.LastFM = require(__dirname + '/lastfm.js');
	this.PushBullet = require(__dirname + '/pushbullet');

	this.user = {};

	this.checkNewReleases = function(user)
	{
		scope.user = user;
		var lastFM = new scope.LastFM();
		lastFM.getNewReleases(scope.user, scope.parseNewReleases);
	};

	this.parseNewReleases = function(err, req, releases)
	{
		if(err) { console.log('Error: ' + err); }
		releases.albums.album.forEach(function(release)
		{
			release.user = scope.user._id;

			var search =
			{
				user: release.user,
				mbid: release.mbid,
				name: release.name
			};

			scope.Album.findOrCreate(search, release, function(err, album, created)
			{
				if(created)
				{
					console.log("Created Album: " + album.name);
					if(scope.user.notificationproviders.hasOwnProperty('pushbullet'))
					{
						scope.PushBullet({
							title: album.artist.name + ' released a new album',
							body: album.name
						}, scope.user);
					}
				} else
				{
					console.log("Album existed: " + album.name);
				}
			});
		});
	};
};
