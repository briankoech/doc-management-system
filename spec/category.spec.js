(function() {
  'use strict';
  var app = require('../server');
  var request = require('supertest');
  var helper = require('./seed-helper');

  describe('test for document category', function() {
    var token;

    beforeAll(function(done) {
      helper.seed(function(body) {
        token = body.token;
        done();
      });
    });

    it('create a new type only if you are authenticated', function(done) {
      request(app)
        .post('/api/category')
        .send({
          category: 'People'
        })
        .set('Accept', 'application/json')
        .set('x-access-token', null)
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.status).toEqual(401);
          expect(res.body).toBeDefined();
          expect(res.body.message).toBe('jwt malformed');
          done();
        });
    });

    it('New type has a unique title', function(done) {
      request(app)
        .post('/api/category')
        .send({
          category: 'music'
        })
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.status).toEqual(409);
          expect(res.body).toBeDefined();
          expect(res.body.error).toContain('E11000 duplicate key error index: test.categories.$category_1 dup key: { : "music" }');
          done();
        });
    });

    it('Cannot create category if title isnt provided', function(done) {
      request(app)
        .post('/api/category')
        .send({})
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.body).toBeDefined();
          expect(res.status).toBe(406);
          expect(res.body.error).toContain('Category validation failed');
          done();
        });
    });

    it('Types can be fetched', function(done) {
      request(app)
        .get('/api/category')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.body).toBeDefined();
          expect(res.status).toBe(200);
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(4);
          done();
        });
    });

    it('Type can be updated', function(done) {
      // get the id to update
      request(app)
        .get('/api/category')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end(function(err, res) {
          request(app)
            .put('/api/category/' + res.body[0]._id)
            .send({
              title: 'songs'
            })
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .end(function(err, res) {
              expect(err).toBeNull();
              expect(res.status).toEqual(200);
              expect(res.body.message).toBeDefined();
              expect(res.body.message).toBe('update was successful');
              done();
            });
        });
    });

    it('Type can be deleted', function(done) {
      request(app)
        .get('/api/category')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end(function(err, res) {
          request(app)
            .delete('/api/category/' + res.body[0]._id)
            .send({
              title: 'songs'
            })
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .end(function(err, res) {
              expect(err).toBeNull();
              expect(res.status).toEqual(200);
              expect(res.body.message).toBeDefined();
              expect(res.body.message).toBe('Deleted successfully');
              done();
            });
        });
    });
  });
})();
