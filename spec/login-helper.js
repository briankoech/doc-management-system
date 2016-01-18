(function() {
  'use strict';

  var request = require('supertest');

  module.exports = {
    login: function(app, username, password, done) {
      request(app)
        .post('/api/users/login')
        .send({
          username: username,
          password: password
        })
        .end(function(err, res) {
          if (err) {
            done(null);
          } else {
            done(res.body);
          }
        });
    }
  };
})();
