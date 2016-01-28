(function() {
  'use strict';

  var request = require('supertest');
  var app = require('../server');
  var helper = require('./seed-helper.js');

  describe('15. Documents', function() {
    var token;
    var userId;

    beforeAll(function(done) {
      helper.seed(function(body) {
        token = body.token;
        userId = body.user._id;
        done();
      });
    });

    describe('Documents', function() {

      it('user has loged in', function(done) {
        expect(token).toBeDefined();
        done();
      });

      it('viewer cannot create a document', function(done) {
        helper.login('drogba', 'abc123', function(body) {
              request(app)
                .post('/api/document/')
                .send({
                  ownerId: body.user._id,
                  title: 'TIA',
                  category: 'Lifestyle',
                  content: 'Keeping up with being TIA',
                  createdAt: new Date()
                })
                .set('Accept', 'application/json')
                .set('x-access-token', body.token)
                .end(function(err, rs) {
                  expect(err).toBeNull();
                  expect(rs.status).toEqual(403);
                  expect(rs.body.error).toBeDefined();
                  expect(rs.body.error).toBe('You are not authorised to create document');
                  done();
                });
        });
      });

      it('16. Doc created has a published date', function(done) {
        request(app)
          .post('/api/document')
          .send({
            ownerId: userId,
            title: 'Welcome to Andela',
            category: 'Music',
            content: 'This is Andela',
            createdAt: new Date()
          })
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .end(function(err, res) {
            expect(err).toBeNull();
            expect(res.body).toBeDefined();
            expect(res.status).toEqual(201);
            expect(res.body.message).toBe('Document created successfuly');
            expect(res.body.doc).toBeDefined();
            expect(res.body.doc.createdAt).toBeDefined();
            done();
          });
      });

      it('17. returns documents limited by a specified number', function(done) {
        request(app)
          .get('/api/document')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .end(function(err, res) {
            expect(err).toBeNull();
            expect(res.status).toEqual(200);
            expect(res.body).toBeDefined();
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body.length).toBeLessThan(10);
            done();
          });
      });

      it('18. returns docs in order of their date', function(done) {
        request(app)
          .get('/api/document/date/?from=10-10-2015&to=10-10-2016')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .end(function(err, res) {
            expect(res.body).toBeDefined();
            expect(res.status).toEqual(200);
            expect(res.body[0].createdAt).toBeDefined();
            done();
          });
      });
    });

    describe('19. Search', function() {
      it('Fetch all documents based on user role', function(done) {
        request(app)
          .get('/api/role/document')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .end(function(err, res) {
            expect(err).toBeNull();
            expect(res.status).toEqual(200);
            expect(res.body).toBeDefined();
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toEqual(4);
            done();
          });
      });

      it('Gets all documents published between the specified dates', function(done) {
        request(app)
          .get('/api/document/date/?from=10-10-2015&to=10-10-2016')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .end(function(err, res) {
            expect(err).toBeNull();
            expect(res.body).toBeDefined();
            expect(res.status).toEqual(200);
            expect(res.body[0].createdAt).toBeDefined();
            done();
          });
      });

      it('Gets viewer\'s documents', function(done) {
        helper.login('drogba', 'abc123', function(body) {
          expect(body.token).toBeDefined();
          request(app)
            .get('/api/role/document')
            .set('Accept', 'application/json')
            .set('x-access-token', body.token)
            .end(function(err, res) {
              expect(err).toBeNull();
              expect(res.body).toBeDefined();
              expect(res.status).toEqual(200);
              expect(Array.isArray(res.body)).toEqual(true);
              expect(res.body.length).toEqual(2);
              done();
            });
        });
      });

      it('returns documents by category', function(done) {
        request(app)
          .get('/api/document/category/?category=music')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .end(function(err, res) {
            expect(err).toBeNull();
            expect(res.body).toBeDefined();
            expect(res.status).toEqual(200);
            expect(res.body.length).toEqual(5);
            expect(typeof res.body[0]).toBe('object');
            done();
          });
      });

      it('22. non-contributor cannot contribute to a document', function(done) {
        helper.login('martial', 'abc123', function(body) {
          request(app)
            .get('/api/document')
            .set('Accept', 'application/json')
            .set('x-access-token', body.token)
            .end(function(err, res) {
              request(app)
                .put('/api/document/' + res.body[0]._id)
                .send({
                  title: 'TDD',
                  content: 'jasmon vs mocha'
                })
                .set('Accept', 'application/json')
                .set('x-access-token', body.token)
                .end(function(err, rs) {
                  expect(err).toBeNull();
                  expect(rs.status).toEqual(403);
                  expect(rs.body.message).toBeDefined();
                  expect(rs.body.message).toBe('You are not allowed to edit this doc');
                  done();
                });
            });
        });
      });
    });
  });
})();
