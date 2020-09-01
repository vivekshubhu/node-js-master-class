/**
 * Test runner
 * 
 */

// Override the NODE_ENV variable
process.env.NODE_ENV = 'testing';


// Application logic for the tests runner
_app = {};

// Container for the tests
_app.tests = {};

// Add on the unit tests
_app.tests.unit = require('./unit');
_app.tests.api = require('./api');


// Count all the tests
_app.countTests = function() {
    let counter = 0;
    for(let key in _app.tests) {
        if(_app.tests.hasOwnProperty(key)) {
            let subTests = _app.tests[key];
            for(let testName in subTests) {
                if(subTests.hasOwnProperty(testName)) {
                    counter ++;
                }
            }
        }
    }
    return counter;
}

//Run all the test, collecting the error and success
_app.runTests = function () {
    let errors = [];
    let successes = 0;
    let limit = _app.countTests();
    let counter = 0;
    for (let key in _app.tests) {
        if (_app.tests.hasOwnProperty(key)) {
            let subTests = _app.tests[key];
            for (let testName in subTests) {
                if (subTests.hasOwnProperty(testName)) {
                    (function () {
                        let tempTestName = testName;
                        let testValue = subTests[testName];
                        // Call the test
                        try {
                            testValue(function () {
                                // If it call back, then it success and log in green
                                console.log('\x1b[32m%s\x1b[0m', tempTestName); //green
                                counter++;
                                successes++;
                                if (counter == limit) {
                                    _app.produceTestReport(limit, successes, errors);
                                }
                            })
                        } catch (e) {
                            // If it throw, capture and log it in red
                            errors.push({
                                'name': testName,
                                'error': e
                            });
                            console.log('\x1b[31m%s\x1b[0m', tempTestName); //green
                            counter ++;
                            if (counter == limit) {
                                _app.produceTestReport(limit, successes, errors);
                            }
                        }
                    }())
                }
            }
        }
    }
}

// Produce a test report
_app.produceTestReport = function(limit, successes, errors) {
    console.log('');
    console.log('--------- BEGIN TEST REPORT ---------');
    console.log('');
    console.log('Total Tests : ',  limit);
    console.log('Pass : ', successes);
    console.log('fail : ', errors.length);

    // If there are errors, print them in default
    if(errors.length > 0) {
        console.log('--------- BEGIN ERROR DETAILS ---------');
        console.log('');
        
        errors.forEach(function(testError) {
            console.log('\x1b[31m%s\x1b[0m', testError); //green
            console.log(testError.error);
            console.log('');
        });

    }
    console.log('');
    console.log('--------------- END TEST REPORT -----------------');
    process.exit(0);
}



// run the test
_app.runTests();

