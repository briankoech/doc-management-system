(function() {
	'use strict';
	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;

	var RoleSchema = new Schema({
		userId: {type: Number},
		role: {type: String}
	});

	module.exports = RoleSchema;
})();