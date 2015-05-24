#!/bin/env node

function sendPushbulletNote(note, user)
{
	this.PushBullet = require('pushbullet');
	this.pusher = new this.PushBullet(user.notificationproviders.pushbullet.accesstoken);
	this.pusher.note(user.notificationproviders.pushbullet.device.iden, note.title, note.body, function(error, response)
	{
		if(error){ console.log("Error notfying user: " + error); }
	});
}

module.exports = sendPushbulletNote;
