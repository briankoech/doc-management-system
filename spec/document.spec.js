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
            expect(res.body).toBeDefined();
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body.length).toBeLessThan(10);
            done();
          });
      });

      it('18. returns docs in order of their date', function(done) {
        request(app)
          .get('/api/documentbydate/?from=10-10-2015&to=10-10-2016')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .end(function(err, res) {
            expect(res.body).toBeDefined();
            expect(res.body[0].createdAt).toBeDefined();
            done();
          });
      });
    });

    describe('19. Search', function() {
      it('20. getAllDocumentsByRole', function(done) {
        request(app)
          .get('/api/documentbyrole')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .end(function(err, res) {
            expect(err).toBeNull();
            expect(res.body).toBeDefined();
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toEqual(4);
            done();
          });
      });

      it('21. getAllDocumentsByDate', function(done) {
        request(app)
          .get('/api/documentbydate/?from=10-10-2015&to=10-10-2016')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .end(function(err, res) {
            expect(err).toBeNull();
            expect(res.body).toBeDefined();
            expect(res.body[0].createdAt).toBeDefined();
            done();
          });
      });

      it('20. getAllDocumentsByRole', function(done) {
        helper.login('drogba', 'abc123', function(body) {
          expect(body.token).toBeDefined();
          request(app)
            .get('/api/documentbyrole')
            .set('Accept', 'application/json')
            .set('x-access-token', body.token)
            .end(function(err, res) {
              expect(err).toBeNull();
              expect(res.body).toBeDefined();
              expect(Array.isArray(res.body)).toEqual(true);
              expect(res.body.length).toEqual(2);
              done();
            });
        });
      });

      it('21. returns documents by category', function(done) {
        request(app)
          .get('/api/documentbycategory/?category=music')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .end(function(err, res) {
            expect(err).toBeNull();
            expect(res.body).toBeDefined();
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
