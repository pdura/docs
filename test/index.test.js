/**
 * Module dependencies.
 */

var docsapp = require('../app');
var nconf = require('nconf');
var request = require('request');
var assert = require('assert');

describe('Application', function() {
  after(function (done) {
    docsapp.stop(done);
  });

  describe('GET /test', function(){
    it('should respond OK with json', function(done){

      console.log(nconf.get('BASE_URL'));

      request.get('http://localhost:' + nconf.get('PORT') + '/test', function (err, resp, body) {
        assert.equal(resp.statusCode, 200);
        done();
      });
    });
  });

});
