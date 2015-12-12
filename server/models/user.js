(function() {
	'use strict';
	var mongoose = require('mongoose');
	var bcrypt = require('bcrypt-nodejs');
	var Schema = mongoose.Schema;

	var UserSchema = new Schema({
		username: {type: String, require: true, index: {unique: true}},
		name: {
			first: {type: String},
			last: {type: String}
		},
		email: {
			type: String, 
			required: true, 
			validate: {
				validator: function(v) {
					return /[a-zA-Z]{1,}@[a-zA-Z]{1,10}.[a-z]{1,3}/.test(v);
				},
				message: '{VALUE} is not a valid email address'
			}
		},
		password: {type: String, required: true, select: false},
		createdAt: {type: Date},
		updated: { type: Date, default: Date.now }
	});

	// Hash the password before save
	UserSchema.pre('save', function(next) {
		var self = this;

		bcrypt.hash(self.password, null, null, function(err, hash) {
			if(err) return next(err);

			self.password = hash;
			next();
		});
	});

	// extend method to compare password
	UserSchema.methods.comparePassword = function(password) {
		var user = this;
		return bcrypt.compareSync(password, user.password); // true or false
	};

	module.exports = mongoose.model('User', UserSchema);

})();