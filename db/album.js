#!/bin/env node

var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var Schema = mongoose.Schema;
var albumSchema = new Schema(
{
	user: {type: Schema.Types.ObjectId, index: true},
	name: {type: String, default: ''},
	mbid: {type: String, default: '', index: true},
	url: {type: String, default: ''},
	artist:
	{
		name: {type: String},
		mbid: {type: String},
		url: {type: String}
	},
	image: {type: Array},
	notified: {type: Boolean, default: false}
}, { autoIndex: false });

albumSchema.plugin(findOrCreate);

module.exports = mongoose.model('Album', albumSchema);
