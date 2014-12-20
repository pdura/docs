/**
 * Module dependencies.
 */

var request = require('supertest');
var docsapp = require('../app');
var nconf = require('nconf');

describe('Application', function() {
  describe('GET /test', function(){
    it('should respond OK with json', function(done){
      request(docsapp._app)
        .get('/test')
        .expect(200, done);
    });
  });

  describe('GET /salesforceapi-tutorial', function(){
    it('should respond REDIRECT with Location', function(done){
      request(docsapp._app)
        .get(nconf.get('BASE_URL') + '/salesforceapi-tutorial')
  		.expect('Location', nconf.get('BASE_URL') + '/server-apis/salesforce')	
        .expect(301, done);
    });
  });
});
