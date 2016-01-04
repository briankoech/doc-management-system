(function() {
  'use strict';
  var request = require('supertest');
  var app = require('../server');
  var user = {
    username: 'koech',
    firstname: 'Brian',
    lastname: 'Koech',
    email: 'brn@koech.com',
    roleId: '568a1a680ff812b705ff1cae',
    password: 'abc123'
  };
  var token;

  describe('User', function() {
    it('creates a user Successfully', function(done) {
      request(app)
        .post('/api/users')
        .send(user)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          console.log('creation error');
          console.log(res.body);
          expect(err).toBe(null);
          expect(typeof res.body).toBe('object');
          expect(res.body).toBeDefined();
          expect(res.body.message).toBe('User created Successfully');
          done();
        });
    });

    it('creates a unique user', function(done) {
      request(app)
        .post('/api/users')
        .send(user)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          console.log('Duplication error');
          console.log(res.body);
          expect(err).toBeNull();
          expect(res.body.error).toBeDefined();
          expect(res.body.error).toContain('duplicate key');
          done();
        });
    });

    it('user created has a role defined', function(done) {
      request(app)
        .post('/api/users')
        .send(user)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          console.log(res.body);
          expect(err).toBeNull();
          expect(res.body.user.roleId).toBeDefined();
          expect(res.body.user.roleId).toBe('568a1a680ff812b705ff1cae');
          done();
        });
    });

    it('user created has both first and last name', function(done) {
      request(app)
        .post('/users')
        .send(user)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(res.body.user.name.first).toBe('Brian');
          expect(res.body.user.name.last).toBe('Koech');
          done();
        });
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
