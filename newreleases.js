#!/bin/env node

module.exports = function()
{
	var scope = this;
	this.Album = require(__dirname + '/db/album.js');
	this.LastFM = require(__dirname + '/lastfm.js');
	this.PushBullet = require('pushbullet');

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
						var pusher = new scope.PushBullet(scope.user.notificationproviders.pushbullet.accesstoken);
						var noteTitle = 'New album released';
						var noteBody = album.artist.name + ' released a new album.\n' + album.name;
						pusher.note(scope.user.notificationproviders.pushbullet.deviceidentifier, noteTitle, noteBody, function(error, response)
						{
							if(error){ console.log("Error notfying user: " + error); }
							console.log("Notified About new Album");
						});
					}
				} else
				{
					console.log("Album existed: " + album.name);
				}
			});
		});
	};
};
