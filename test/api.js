/**
 * 
 * API tests
 */

//Dependencies
let app = require('./../index');
let assert = require('assert');
let http = require('http');
let config = require('./../lib/config');

// Holder for the test

let api = {};

// Helpers
let helpers = {};
helpers.makeGetRequest = function (path, callback) {
    let requestDetails = {
        'protoocol': 'http',
        'hostname': 'localhost',
        'port': config.httpPort,
        'method': 'GET',
        'path': path,
        'header': {
            'Content-Type': 'application/json'
        }
    }
    // Send the request
    let req = http.request(requestDetails, function (res) {
        callback(res);
    });
    req.end();
};

// THe main init function should be able to run without throwing
api['app.init should start without throwing'] = function(done) {
    assert.doesNotThrow(function() {
        app.init(function(err) {
            done();
        });
    }, TypeError);
};

// Make a request to a /ping
api['/ping should respond to GET with 200'] = function(done) {
    helpers.makeGetRequest('/ping', function(res) {
        assert.equal(res.statusCode, 201);
        done();
    });
}

// Make a request to a /api/users
api['/api/users should respond to GET with 400'] = function(done) {
    helpers.makeGetRequest('/api/users', function(res) {
        assert.equal(res.statusCode, 400);
        done();
    });
}

// Make a request to a ramdom path
api['A random path should respond to GET with 404'] = function(done) {
    helpers.makeGetRequest('/this/path/shouldnt/exist', function(res) {
        assert.equal(res.statusCode, 404);
        done();
    });
}


// Exports the test to the runner
module.exports = api;