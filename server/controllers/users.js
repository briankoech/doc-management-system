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
            if (err && err.errmsg.indexOf('duplicate key') > -1) {
              return res.status(409).send({
                error: err
              });
            } else if (err) {
              return res.status(500).send({
                error: err
              });
            }
            user.password = null;
            res.status(201).send({
              message: 'User created Successfully',
              user: user
            });
          });
        } else {
          res.status(404).send({
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
            // update the loggedIn column to true
            User.findOneAndUpdate({
              username: user.username
            }, {
              $set: {
                loggedIn: true
              }
            }, {
              new: true
            }, function(err, result) {
              if (err) {
                res.status(500).send({
                  error: err
                });
              } else if (result) {
                //console.log('THISHISHISH', result);
                //result.password = null;
                var token = createToken(result);
                res.status(200).send({
                  success: true,
                  message: 'login success',
                  token: token,
                  user: result
                });
              } else {
                res.status(401).send({
                  message: 'could not log in'
                });
              }
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
      var errormsg = {
        success: false,
        message: 'Failed to authenticate user'
      };
      // check if token exists
      if (token) {
        jwt.verify(token, secretKey, function(err, decoded) {
          if (err) {
            res.status(401).send(err);
          } else {
            // check if loggedIn is true
            req.decoded = decoded;
            User.findById(req.decoded._id, function(err, user) {
              if (err) {
                res.status(401).send(errormsg);
              } else {
                if (user && user.loggedIn) {
                  next();
                } else {
                  res.status(401).send(errormsg);
                }
              }
            });
          }
        });
      } else {
        res.status(401).send({
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
          next();
        }

      });
    },

    findOne: function(req, res) {
      res.send(req.user);
    },

    update: function(req, res) {
      // check if user is admin | self
      Role.findById(req.decoded.role, function(err, role) {
        if (err) {
          res.status(500).send({
            error: err
          });
        } else {
          User.findById(req.params.userId, function(err, user) {
            if (err) {
              res.status(500).send({
                error: err
              });
            } else if (!user) {
              res.status(404).send({
                message: 'no such user'
              });
            } else {
              if (role.title === 'admin' || req.decoded._id.toString() === user._id.toString()) {
                //user.password = null;
                req.user = user;
                req.user.name.first = req.body.firstname;
                req.user.name.last = req.body.lastname;
                req.user.email = req.body.email;
                user.save(function(err, result) {
                  if (err) {
                    res.status(500).send({
                      error: err,
                      user: user
                    });
                  } else {
                    res.status(200).send({
                      message: 'update successful',
                      user: result
                    });
                  }

                });

              } else {
                res.status(403).send({
                  message: 'You are not allowed to edit this user'
                });
              }
            }
          });

        }
      });
    },

    delete: function(req, res) {
      // check if user is admin | self
      Role.findById(req.decoded.role, function(err, role) {
        if (err) {
          res.status(500).send({
            error: err
          });
        } else {
          User.findById(req.params.userId, function(err, user) {
            if (err) {
              res.status(500).send({
                error: err
              });
            } else if (!user) {
              res.status(404).send({
                message: 'no such user'
              });
            } else {
              if (role.title === 'admin' || req.decoded.id === user._id) {
                User.remove({
                  _id: req.params.userId
                }, function(err) {
                  if (err) {
                    res.status(500).send({
                      error: err
                    });
                  } else {
                    if (req.decoded.id === user._id) {
                      this.logout;
                    } else {
                      res.status(200).send({
                        message: 'delete successful'
                      });
                    }

                  }
                });
              } else {
                res.status(403).send({
                  message: 'You are not allowed to delete this user'
                });
              }
            }
          });

        }
      });
    },

    logout: function(req, res) {
      req.headers['x-access-token'] = null;

      User.findOneAndUpdate({
        _id: req.decoded._id
      }, {
        $set: {
          loggedIn: false
        }
      }, {
        new: true
      }, function(err, result) {
        if (err) {
          res.status(404).send({
            error: req.decoded,
            err: err,
            rs: result
          });
        } else {
          res.status(200).send({
            success: true,
            message: 'You are now logged out'
          });
        }
      });
    }
  };
})();
