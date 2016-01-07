(function() {
  'use strict';

  var request = require('supertest');

  module.exports = {
    create: function(app, done) {
      //add a user to the db
      request(app)
        .post('/api/users')
        .send({
          username: 'mark',
          firstname: 'Mark',
          lastname: 'Zuckerberg',
          email: 'mark@fb.com',
          role: 'admin',
          password: 'abc123'
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.body).toBeDefined();
          done();
        });
    },

    login: function(app, username, password, done) {
      request(app)
        .post('/api/users/login')
        .send({
          username: username,
          password: password
        })
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.status).toBe(200);
          done(res.body.token);
        });
    }
  };
})();
