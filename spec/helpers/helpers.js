(function() {
  'use strict';
  var seeder = require('mongoose-seed');
  var db = require('../../server/config/config');
  var data = [{
    'model': 'Role',
    'documents': [{
      'title': 'admin'
    }, {
      'title': 'contributor'
    }]
  }, {
    'model': 'User',
    'documents': [{
      username: 'mark',
      firstname: 'Mark',
      lastname: 'Zuckerberg',
      email: 'mark@fb.com',
      role: 'admin',
      password: 'abc123'
    }]
  }];

  seeder.connect(db.database, function() {
    // Load models
    seeder.loadModels(['./server/models/document.js',
      './server/models/role.js',
      './server/models/user.js',
      './server/models/category.js'
    ]);

    // clear the specified models
    seeder.clearModels(['Document', 'Role', 'User', 'Category'], function() {
      seeder.populateModels(data);
    });
  });

})();
