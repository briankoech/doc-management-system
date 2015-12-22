(function() {
	'use strict';

	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;

	var RoleSchema = new Schema({
		userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
		docId: {type: Schema.Types.ObjectId, ref: 'Document', required: true},
		role: {type: String, enum: ['owner', 'admin', 'contributor']}
	});

	module.exports = mongoose.model('Role', RoleSchema);
})();
