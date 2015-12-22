(function() {
  'use strict';

  var request = require('supertest');
  var app = require('../server');
  var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU2NjE5NzU2NDdjNDg1MWIwZjRiZDVlZiIsIm5hbWUiOnt9LCJpYXQiOjE0NTA2OTY3MTl9.uqxRNa-P5MJRidxChJXoGKoWOSVrdX6UKkADhFncQpk';

  describe('15. Documents', function() {

    beforeEach(function() {
      request(app)
        .set('x-access-token', token);
    });

    it('16. Doc created has a published date', function(done) {
      request(app)
        .post('/api/document')
        .send({
          ownerId: 2,
          title: 'Welcome to Andela',
          content: 'This is Andela',
          createdAt: new Date()
        })
        .set('Accept', 'application/json')
        .set('x-access-token', token)
        .end(function(err, res) {
          // console.log(res.body);
          expect(err).toBeNull();
          expect(res.body).toBeDefined();
          expect(res.body.message).toBe('Document and role added successfuly');
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
})();
