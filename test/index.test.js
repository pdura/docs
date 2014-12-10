/**
 * Module dependencies.
 */

var request = require('supertest');
var docsapp = require('../app');

describe('Application', function() {
  describe('GET /test', function(){
    it('should respond OK with json', function(done){
      request(docsapp._app)
        .get('/test')
        .expect(200, done);
    });
  });
});
