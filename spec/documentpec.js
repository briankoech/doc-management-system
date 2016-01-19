(function() {
  'use strict';

  var request = require('supertest');
  var app = require('../server');
  var helper = require('./login-helper.js');
  require('./helpers/seed-helper')();

  describe('15. Documents', function() {
    var token;
    var userId;

    beforeEach(function(done) {
      helper.login(app, 'mark', 'abc123', function(body) {
        if (body) {
          token = body.token;
          // console.log('BODYNBODJDJ IS RUNNING TOO', body.user._id);
          userId = body.user._id;
          done();
        } else {
          return;
        }
      });
    });

    it('function delay', function(done) {
      // console.log('DELAYS FOR SOMETIME', token);

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
          console.log(res.body);
          expect(res.body.doc).toBeDefined();
          expect(res.body.doc.createdAt).toBeDefined();
          expect(typeof res.body.role).toBe('object');
          done();
        });
    });

    it('17. returns documents limited by a specified number', function(done) {
      request(app)
        .get('/api/document')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end(function(err, res) {
          //console.log(res.body);
          expect(err).toBeNull();
          expect(res.body).toBeDefined();
          expect(Array.isArray(res)).toBe(true);
          expect(res.length).toBeGreaterThan(0);
          expect(res.length).toBeLessThan(10);
          done();
        });
    });

    it('18. returns docs in order of their date', function(done) {
      request(app)
        .get('/api/document')
        .set('Accept', 'application/json')
        .end(function(err, docs) {
          expect(docs).toBeDefined();
          //expect(docs[0].createdAt).toBeLessThan(docs[3].createdAt);
          done();
        });
    });
  });

  describe('19. Search', function() {
    it('20. getAllDocumentsByRole', function(done) {
      request(app)
        .get('/api/document/getAllDocumentsByRole')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.body).toBeDefined();
          done();
        });
    })();

    it('21. getAllDocumentsByDate', function(done) {
      request(app)
        .get('/api/document/documentbydate')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.body).toBeDefined();
          done();
        });
    })();

    it('20. getAllDocumentsByRole', function(done) {
      request(app)
        .get('/api/document/getAllDocumentsByRole')
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.body).toBeDefined();
          done();
        });
    })();
  });
})();
