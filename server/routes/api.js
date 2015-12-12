(function() {
	'use strict';

	var User = require('../models/user');
	var config = require('../config/config');
	var jwt = require('jsonwebtoken');
	var secretKey = config.secretKey;

	function createToken(user) {
		var token = sign({
			id: user._id,
			name: user.name,
			username: user.username
		}, secretKey, {
			expiresInMinute: 1440
		});

		return token;
	}

	module.exports = function(app, express) {
		var api = express.Router;

		api.post('/users/', function(req, res) {
			// create a new user
			var user = new User({
				username: req.body.username,
				name: {
					first: req.body.firstname,
					last: req.body.lastname
				},
				email: req.body.email,
				password: req.body.password,
				createdAt: Date.now,
				updatedAt: Date.now
			});

			//save the user
			user.save(function(err) {
				if(err) {
					res.send(err);
					return;
				}
				res.json({message: "User created Successfully"})
			});
		}); // close sign-up

		api.post('/users/login', function() {
			User.findOne({
				username: req.body.username
			}).select('password').exec(function(err, user) {
				if (err) {
					res.send(err);
				}
				// if no user is found
				if(!user) {
					res.send({message: "No such user exists"});
				} else if(user) {
					// validate the password
					var validePassword = user.comparePassword(req.body.password);
					if(!validePassword) {
						res.send({message: "Invalid password"});
					} else {
						// user is valid. create a token to save user
						var token = createToken(user);
						res.json({
							success: true,
							message: "login success",
							token: token
						});
					}
				}
			});
		});
	}

})();