(function() {
  'use strict';

  var request = require('supertest');
  var app = require('../server');
  var helper = require('./seed-helper');

  describe('User', function() {
    var token;

    beforeAll(function(done) {
      helper.seed(function(body) {
        token = body.token;
        done();
      });
    });

    it('creates a user Successfully', function(done) {
      request(app)
        .post('/api/users')
        .send({
          username: 'koech',
          firstname: 'Brian',
          lastname: 'Koech',
          email: 'brn@koech.com',
          role: 'admin',
          password: 'abc123'
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(typeof res.body).toBe('object');
          expect(res.body).toBeDefined();
          expect(res.body.message).toBe('User created Successfully');
          done();
        });
    });

    it('creates a unique user', function(done) {
      request(app)
        .post('/api/users')
        .send({
          username: 'koech',
          firstname: 'Brian',
          lastname: 'Koech',
          email: 'brn@koech.com',
          role: 'admin',
          password: 'abc123'
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.body.error).toBeDefined();
          expect(res.body.error.errmsg).toContain('duplicate key error');
          done();
        });
    });

    it('user created has a role defined', function(done) {
      request(app)
        .post('/api/users')
        .send({
          username: 'Ruth',
          firstname: 'Ruth',
          lastname: 'Moses',
          email: 'ruth@moses.com',
          role: 'contributor',
          password: 'abc123'
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.body.user.role).toBeDefined();
          done();
        });
    });

    it('user created has both first and last name', function(done) {
      request(app)
        .post('/api/users')
        .send({
          username: 'Mary',
          firstname: 'Mary',
          lastname: 'Anne',
          email: 'mary@ann.com',
          role: 'contributor',
          password: 'abc123'
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(res.body.user.name.first).toBe('Mary');
          expect(res.body.user.name.last).toBe('Anne');
          done();
        });
    });

    it('user logs in successfully', function(done) {
      expect(token).toBeDefined();
      done();
    });

    it('Returns all users when getAllUsers is called', function(done) {
      request(app)
        .get('/api/users')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(2);
          done();
        });
    });

  });
})();
