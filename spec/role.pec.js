(function() {
  'use strict';

  var request = require('supertest');
  var app = require('../server');
  var seed = require('./seed-helper');

  describe('Roles', function() {

    var token;

    beforeAll(function(done) {
      seed(app, function(body) {
        console.log('TOKEN IS HERE ROLE', body);
        token = body.token;
        done();
      });
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
          // console.log(res.body);
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
