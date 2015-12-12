(function() {
  'use strict';
  var request = require('request');
  var base_url = 'http://localhost:8080';

  describe('Test for document management api', function() {

    describe('GET /', function() {
      it('returns status code of 200', function(done) {
      	request.get(base_url, function(err, res, body) {
      		expect(res.statusCode).toBe(200);
      	});
      });

      it('returns Hello world', function(done) {
      	request.get(base_url, function(err, res, body) {
      		expect(body).toBe("This is happening");
      	});
      });
    });
    
  });
})();
