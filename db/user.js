#!/bin/env node

var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var Schema = mongoose.Schema;
var userSchema = new Schema(
{
	active: {type: Boolean, default: true},
	username: {type: String, default: ''},
	name:
	{
		first: {type: String, default: ''},
		last: {type: String, default: ''}
	},
	email: {type: String, default: ''},
	dates:
	{
		created: { type: Date, default: Date.now },
		loggedin: { type: Date, default: Date.now }
	},
	auth:
	{
		provider: {type: String},
		id: {type: String}
	},
	picture: {type: String},
	gender: {type: String},
	providers: {type: Object},
	notificationproviders: {type: Object},
	crontime: {type: String, default: '00 00 12 * * *'},
	crontimeObject: {
		seconds: 	{type: Number, default: 0},
		minutes: 	{type: Number, default: 0},
		hours: 		{type: Number, default: 12},
		day: 			{type: Number, default: -1},
		month: 		{type: Number, default: -1},
		weekday: 	{type: Number, default: -1},
	},
	timezone: {type: String, default: 'Europe/Amsterdam'}
}, {
	autoIndex: false,
	toObject: {virtuals: true},
    toJSON: {virtuals: true}
	});

userSchema.plugin(findOrCreate);

userSchema.virtual('name.full').get(function()
{
	return this.name.first + ' ' + this.name.last;
});

module.exports = mongoose.model('User', userSchema);
