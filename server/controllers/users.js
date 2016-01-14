(function() {
  'use strict';

  var User = require('../models/user'),
    Role = require('../models/role'),
    config = require('../config/config'),
    jwt = require('jsonwebtoken'),
    secretKey = config.secretKey;

  function createToken(user) {
    var token = jwt.sign(user, secretKey, {
      expiresInMinute: 1440
    });
    return token;
  }

  module.exports = {
    create: function(req, res) {
      // get the roleid from
      Role.findOne({
        'title': req.body.role
      }, function(err, role) {
        if (err) {
          res.status(500).send({
            error: 'Server error. Couldn\'t fetch role'
          });
        } else if (role) {
          // create a new user
          var user = new User({
            username: req.body.username,
            name: {
              first: req.body.firstname,
              last: req.body.lastname
            },
            email: req.body.email,
            role: role._id,
            password: req.body.password,
            createdAt: new Date()
          });

          //save the user
          user.save(function(err, user) {
            if (err) {
              res.status(500).send({
                error: err
              });
              return;
            }
            user.password = null;
            res.status(201).send({
              message: 'User created Successfully',
              user: user
            });
          });
        } else {
          res.status(500).send({
            error: 'No such role defined'
          });
        }
      });
    },

    login: function(req, res) {
      User.findOne({
        username: req.body.username
      }).select('password name email role username').exec(function(err, user) {
        if (err) {
          res.send(err);
        }
        // if no user is found
        if (!user) {
          res.send({
            error: 'No such user exists'
          });
        } else if (user) {
          // validate the password
          var validePassword = user.comparePassword(req.body.password);
          if (!validePassword) {
            res.status(500).send({
              message: 'Invalid password'
            });
          } else {
            // user is valid. create a token to save user
            user.password = null;
            var token = createToken(user);
            res.json({
              success: true,
              message: 'login success',
              token: token
            });
          }
        }
      });
    },

    getAllUsers: function(req, res) {
      User.find({}, function(err, users) {
        if (err) throw err;
        res.status(200).send(users);
      });
    },

    // middlewarre to check user auth
    getToken: function(req, res, next) {
      var token = req.headers['x-access-token'];

      // check if token exists
      if (token) {
        jwt.verify(token, secretKey, function(err, decoded) {
          if (err) {
            res.status(403).send({
              success: false,
              message: 'Failed to authenticate user'
            });
          } else {
            req.decoded = decoded;
            // res.send(decoded);
            next();
          }
        });
      } else {
        res.status(403).send({
          success: false,
          message: 'No token provided'
        });
      }
    },

    find: function(req, res, next) {
      User.findById(req.params.userId, function(err, user) {
        if (err) {
          res.status(500).send({
            error: err
          });
        } else if (!user) {
          res.status(400).send({
            error: 'user not found'
          });
          next();
        } else {
          res.status(200).send(user);
        }

      });
    },

    findOne: function(req, res) {
      res.send(req.user);
    },

    update: function(req, res) {
      // check if user is admin | self
      req.user.username = req.body.user;
      req.user.firstname = req.body.firstname;
      req.user.lastname = req.body.lastname;
      req.user.email = req.body.email;
      req.user.updatedAt = req.body.updatedAt;
      req.user.save();
      res.json(req.user);
    },

    delete: function(req, res) {
      // check if user is admin || self
      res.body.remover(function(err) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(204).send('User deleted!');
        }
      });
    }
  };
})();
