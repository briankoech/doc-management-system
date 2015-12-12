(function() {
	'use strict';
	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;

	var DocumentSchema = new Schema({
		ownerId: {type: Number, required: true},
		title: {type: String, required: true},
		content: {type: String, required: true},
		createdAt: {type: Date},
		modifiedAt: {type: Date, Default: Date.now}
	});

	module.exports = mongoose.model('Document', DocumentSchema);
})();