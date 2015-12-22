(function() {
  'use strict';
  var request = require('supertest');
  var app = require('../server');

  describe('User', function() {
    it('creates a user Successfully', function(done) {
      request(app)
      .post('/users')
      .send({
        username: 'koech',
        firstname: 'Brian',
        lastname: 'Koech',
        email: 'brn@koech.com',
        password: 'abc123'
      })
      .set('Accept', 'application/json')
      .end(function(err, user) {
        expect(err).toBe(null);
        expect(typeof user).toBe('object');
        done();
      });
    });

    it('creates a unique user', function() {
      request(app)
      .post('/users')
      .send({
        username: 'koech',
        firstname: 'Mary',
        lastname: 'Kerubo',
        email: 'mary@kerubo.com',
        password: 'abc123'
      })
      .set('Accept', 'application/json')
      .end(function(err, user) {
        expect(err).toBe();
      });
    });

    it('user created has both first and last name', function() {
      request(app)
      .post('/users')
      .send({
        username: 'koech',
        firstname: 'Mary',
        lastname: 'Kerubo',
        email: 'mary@kerubo.com',
        password: 'abc123'
      })
      .set('Accept', 'application/json')
      .end(function(err, user) {
        expect(user.first).toBe('Mary');
        expect(user.last).toBe('Kerubo');
      });
    });

    it('Returns all users when getAllUsers is called', function() {
      request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .end(function(err, users) {
        expect(Array.isArray(users)).toBe(true);
      });
    });

  });
})();
