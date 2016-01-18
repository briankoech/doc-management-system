(function() {
  'use strict';

  var Users = require('../../server/models/user');
  var Document = require('../../server/models/document');
  var Roles = require('../../server/models/role');
  var Category = require('../../server/models/category');
  var async = require('async');
  var seeder = require('mongoose-seed');
  var config = require('../../server/config/config');

  seeder.connect(config.database, function() {
    // Load models
    seeder.loadModels(['./server/models/document.js',
      './server/models/role.js',
      './server/models/user.js',
      './server/models/category.js'
    ]);
    // clear models
    seeder.clearModels(['Document', 'Role', 'User', 'Category'], function() {

      async.waterfall([
        // create roles
        function(callback) {
          var roles = [{
            title: 'admin'
          }, {
            title: 'contributor'
          }];

          Roles.create(roles, function(err, role) {
            if (err) {
              return;
            } else {
              var roleIds = role.map(function(element) {
                return element._id;
              });
              console.log('roles added');
              callback(null, roleIds);
            }
          });
        },

        // create user
        function(roleIds, callback) {
          var users = [{
            username: 'mark',
            firstname: 'Mark',
            lastname: 'Zuckerberg',
            email: 'mark@fb.com',
            role: roleIds[0],
            password: 'abc123',
            loggedIn: false
          }, {
            username: 'wazza',
            firstname: 'Wayne',
            lastname: 'Rooney',
            email: 'rooney@manu.com',
            role: roleIds[0],
            password: 'abc123',
            loggedIn: false
          }, {
            username: 'martial',
            firstname: 'Antony',
            lastname: 'Martial',
            email: 'martial@player.com',
            role: roleIds[1],
            password: 'abc123',
            loggedIn: false
          }, {
            username: 'drogba',
            firstname: 'Didier',
            lastname: 'Drogba',
            email: 'drogba@chelsea.com',
            role: roleIds[2],
            password: 'abc123',
            loggedIn: false
          }];

          Users.create(users, function(err, user) {
            if (err) {
              console.log('error');
              return;
            } else {
              console.log('users added');
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
              console.log('categories error', err);
              return;
            } else {
              console.log('categories added');
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
            category: category[2]._id,
            content: 'Software engineering redefined',
            createdAt: new Date()
          }, {
            ownerId: user[1]._id,
            accessLevel: 2,
            title: 'React vs Angular',
            category: category[3]._id,
            content: 'It doesnt really matter',
            createdAt: new Date()
          }, {
            ownerId: user[0]._id,
            accessLevel: 3,
            title: 'Welcome to Andela',
            category: category[6]._id,
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
              console.log('Documents added');
              done();
              //done();
            }
          });
        }
      ]);
    });
  });

})();
