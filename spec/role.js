(function() {
  'use strict';

  var request = require('supertest');
  var app = require('../server');

describe('Roles', function() {
  it('Role created has a unique title', function(done) {
    request(app)
    .post('/roles')
    .send({
      userId: 1,
      title: 'owner'
    })
    .set('Accept', 'application/json')
    .end(function(err, role) {
      expect();
      done();
    });
  });

  it('Returns all roles when getAll roles is called', function(done) {
    request(app)
    .get('/roles')
    .set('Accept', 'application/json')
    .end(function(err, role) {
      expect(err).toBeNull();
      expect(role).toBe();
      done();
    });
  });
});
})();
