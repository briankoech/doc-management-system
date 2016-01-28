(function() {
  'use strict';

  var Users = require('../server/models/user');
  var Document = require('../server/models/document');
  var Roles = require('../server/models/role');
  var Category = require('../server/models/category');
  var async = require('async');
  var request = require('supertest');
  var app = require('../server');

  module.exports = {
    seed: function(done) {
      async.waterfall([
        // clear db
        function(callback) {
          Users.remove({}, function(err) {
            callback(err);
          });
        },
        function(callback) {
          Document.remove({}, function(err) {
            callback(err);
          });
        },
        function(callback) {
          Roles.remove({}, function(err) {
            callback(err);
          });
        },
        function(callback) {
          Category.remove({}, function(err) {
            callback(err);
          });
        },
        // create roles
        function(callback) {
          var roles = [{
            title: 'admin'
          }, {
            title: 'contributor'
          }, {
            title: 'viewer'
          }];

          Roles.create(roles, function(err, role) {
            if (err) {
              return;
            } else {
              var roleIds = role.map(function(element) {
                return element._id;
              });
              callback(null, roleIds);
            }
          });
        },

        // create user
        function(roleIds, callback) {
          var users = [{
            name: {
              first: 'Mark',
              last: 'Zuckerberg'
            },
            username: 'mark',
            email: 'mark@fb.com',
            createdAt: new Date(),
            role: roleIds[0],
            password: 'abc123',
            loggedIn: false
          }, {
            name: {
              first: 'Wayne',
              last: 'Rooney'
            },
            username: 'wazza',
            email: 'rooney@manu.com',
            createdAt: new Date(),
            role: roleIds[0],
            password: 'abc123',
            loggedIn: false
          }, {
            name: {
              first: 'Antony',
              last: 'Martial'
            },
            username: 'martial',
            email: 'martial@player.com',
            createdAt: new Date(),
            role: roleIds[1],
            password: 'abc123',
            loggedIn: false
          }, {
            name: {
              first: 'Didier',
              last: 'Drogba'
            },
            username: 'drogba',
            email: 'drogba@chelsea.com',
            createdAt: new Date(),
            role: roleIds[2],
            password: 'abc123',
            loggedIn: false
          }];

          Users.create(users, function(err, user) {
            if (err) {
              return;
            } else {
              callback(null, user);
            }

          });
        },
        // create categories
        function(user, callback) {
          var categories = [{
            category: 'music'
          }, {
            category: 'film'
          }, {
            category: 'education'
          }, {
            category: 'programming'
          }, {
            category: 'technology'
          }, {
            category: 'politics'
          }, {
            category: 'business'
          }];

          Category.create(categories, function(err, result) {
            if (err) {
              return;
            } else {
              callback(null, user, result);
            }
          });
        },
        // add document
        function(user, category, done) {
          var docs = [{
            ownerId: user[0]._id,
            accessLevel: 1,
            title: 'Welcome to Andela',
            category: category[0]._id,
            content: 'Software engineering redefined',
            createdAt: new Date()
          }, {
            ownerId: user[1]._id,
            accessLevel: 2,
            title: 'React vs Angular',
            category: category[0]._id,
            content: 'It doesnt really matter',
            createdAt: new Date()
          }, {
            ownerId: user[0]._id,
            accessLevel: 3,
            title: 'Welcome to Andela',
            category: category[0]._id,
            content: 'Stock market prices to increase',
            createdAt: new Date()
          }, {
            ownerId: user[1]._id,
            accessLevel: 3,
            title: 'Adele Hype',
            category: category[0]._id,
            content: 'Hello from the other side',
            createdAt: new Date()
          }];

          Document.create(docs, function(err) {
            if (err) {
              return;
            } else {
              done();
            }
          });
        },
        function(callback) {
          request(app)
            .post('/api/users/login')
            .send({
              username: 'mark',
              password: 'abc123'
            })
            .set('Accept', 'application/json')
            .end(function(err, res) {
              callback(err, res.body);
            });
        }
      ], function(err, body) {
        done(body);
      });
    },

    login: function(username, password, done) {
      request(app)
        .post('/api/users/login')
        .send({
          username: username,
          password: password
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          done(res.body);
        });
    }
  };
})();
