(function() {
  'use strict';

  var request = require('supertest');
  var app = require('../server');
  var helper = require('./login-helper');

  describe('Roles', function() {
    var token;

    beforeEach(function(done) {
      helper.login(app, 'mark', 'abc123', function(body) {
        if (body) {
          token = body.token;
          done();
        } else {
          done();
          return;
        }
      });
    });

    it('Role is alright', function(done) {
      console.log('this is going to work', token);
      done();
    });

    it('Role created successfully', function(done) {
      request(app)
        .post('/api/roles')
        .send({
          title: 'viewer'
        })
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(err).toBeNull();
          console.log(res.body);
          expect(res.body).toBeDefined();
          expect(res.body.title).toBe('viewer');
          done();
        });
    });

    it('Role created has a unique title', function(done) {
      request(app)
        .post('/api/roles')
        .send({
          title: 'admin'
        })
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.body.error).toBeDefined();
          expect(res.body.error).toContain('duplicate key error');
          done();
        });
    });

    it('Returns all roles when getAll roles is called', function(done) {
      request(app)
        .get('/api/roles')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.body).toBeDefined();
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toEqual(3);
          done();
        });
    });
  });
})();
