/**
 * this is the unit test
 */

//Dependencies
let helpers = require('./../lib/helpers');
let assert = require('assert');
let logs = require('./../lib/logs');
let exampleDebuggingProblem = require('./../lib/exampleDebuggingProblem');

// Holder fot tests
let unit = {};

// Assert that the getANumber function is returning a number
unit['helper.getANumber should return a number'] = function (done) {
    let val = helpers.getNumber();
    assert.equal(typeof (val), 'number');
    done();
}

// Assert that the getANumber function is returning 1
unit['helper.getANumber should return 1'] = function (done) {
    let val = helpers.getNumber();
    assert.equal(val, 1);
    done();
}

// Assert that the getANumber function is returning 2
unit['helper.getANumber should return 2'] = function (done) {
    let val = helpers.getNumber();
    assert.equal(val, 2);
    done();
}
// logs.lists should callback an array and a false error
unit['logs.list should callback a false error and an array of log names'] = function (done) {
    logs.list(true, function (err, logFileNames) {
        assert.equal(err, false);
        assert.ok(logFileNames instanceof Array);
        assert.ok(logFileNames.length > 1);
        done();
    });
}

// Logs.truncate should not throw if the logId doesnot exit
unit['logs.truncate should not thow if the logId doesnot exits, it should callback an error instead'] = function (done) {
    assert.doesNotThrow(function () {
        logs.truncate('I donot exit', function (err) {
            assert.ok(err);
            done();
        })
    }, TypeError);
}

// ExampleDebuggingProblem should not throw (but it does)
unit['ExampleDebuggerProblem should not thow'] = function (done) {
    assert.doesNotThrow(function () {
        exampleDebuggingProblem.init();
        done();
    }, TypeError);
}


// Exports the module
module.exports = unit;