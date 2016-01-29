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
          expect(res.status).toEqual(409);
          expect(res.body).toBeDefined();
          expect(res.body.error).toContain('duplicate key error');
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
          expect(res.status).toEqual(409);
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

    it('Cannot create a new role if user is not authenticated', function(done) {
      request(app)
        .post('/api/roles')
        .send({
          title: 'admin'
        })
        .set('Accept', 'application/json')
        .set('x-access-token', null)
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.body).toBeDefined();
          expect(res.status).toEqual(401);
          expect(res.body.message).toBe('jwt malformed');
          done();
        });
    });

    it('Role can be edited only by and admin', function(done) {
      // get the role first
      request(app)
        .get('/api/roles')
        .send({
          title: 'admin'
        })
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end(function(err, res) {
          request(app)
            .put('/api/roles/' + res.body[0]._id)
            .send({
              title: 'administrator'
            })
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .end(function(err, res) {
              expect(err).toBeNull();
              expect(res.status).toEqual(200);
              expect(res.body).toBeDefined();
              expect(res.body.message).toBe('update was successful');
              done();
            });
        });
    });

    it('Role cannot be accessed by a non admin', function(done) {
      // get the role first
      helper.login('martial', 'abc123', function(body) {
        request(app)
          .get('/api/roles')
          .send({
            title: 'admin'
          })
          .set('Accept', 'application/json')
          .set('x-access-token', body.token)
          .end(function(err, res) {
            expect(err).toBeNull();
            expect(res.status).toEqual(403);
            expect(res.body).toBeDefined();
            expect(res.body.message).toBe('You are not authorised');
            done();
          });

      });
    });
  });

})();
