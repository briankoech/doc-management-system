(function() {
  'use strict';

  var request = require('supertest');
  var app = require('../server');
  var helper = require('./seed-helper');

  describe('Roles', function() {

    var token;

    beforeAll(function(done) {
      helper.seed(function(body) {
        token = body.token;
        done();
      });
    });

    it('Role created must be unique', function(done) {
      request(app)
        .post('/api/roles')
        .send({
          title: 'viewer'
        })
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.status).toEqual(500);
          expect(res.body).toBeDefined();
          expect(res.body.error).toBe('E11000 duplicate key error index: test.roles.$title_1 dup key: { : "viewer" }');
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
          expect(res.status).toEqual(500);
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
          expect(res.status).toEqual(200);
          expect(res.body).toBeDefined();
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toEqual(3);
          done();
        });
    });
  });

})();
