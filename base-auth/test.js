//test是使用mocha运行的  mocha test.js

var app = require('./app');
var request = require('supertest').agent(app.listen());
var assert = require('assert');

describe('Koa Basic Auth', function(){

  describe('with no credentials', function(){
    it('should `throw` 401', function(done){
      request
        .get('/')
        .expect(401, done);
    })
  })

  describe('with invalid credentials', function(){
    it('should `throw` 401', function(done){
      request
        .get('/')
        .auth('user', 'invalid password')
        .expect(401, done);
    })
  })

  describe('with valid credentials', function(){
    it('should call the next middleware', function(done){
      request
        .get('/')
        .auth('tj', 'tobi')
        .expect(200)
        .expect('secret', done);
    })
  })
})
