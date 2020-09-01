/**
 * Worker related tasks
 */

//Dependencies
let path = require('path');
let fs = require('fs');
let _data = require('./data');
let https = require('https');
let http = require('http');
let helpers = require('./helpers');
let url = require('url');
let _logs = require('./logs');
let util = require('util');
let debug = util.debuglog('workers');
//Instantiate the worker
let workers = {};

//Look up all the checks, get their data ,send to a validator
workers.gatherAllChecks = function () {
    //Get all the checks
    _data.list('checks', function (err, checks) {
        if (!err && checks && checks.length > 0) {
            // console.log(checks);
            checks.forEach(function (check) {
                //Read in the check data
                _data.read('checks', check, function (err, originalCheckData) {
                    // console.log(originalCheckData);

                    if (!err && originalCheckData) {
                        //Pass it to the check validator, abd let the function continue or log error as needed
                        workers.validateCheckData(originalCheckData);
                    } else {
                        debug('Error reading one of the check\'s data');
                    }
                });
            });
        } else {
            debug('Error : could not find the checks to process');
        }
    })
}

//Sanity-checking the check data
workers.validateCheckData = function (originalCheckData) {
    // console.log(originalCheckData);
    originalCheckData = typeof (originalCheckData) == 'object' && originalCheckData != null ? originalCheckData : {};
    originalCheckData.id = typeof (originalCheckData.id) == 'string' && originalCheckData.id.trim().length == 20 ? originalCheckData.id.trim() : false;
    originalCheckData.userPhone = typeof (originalCheckData.userPhone) == 'string' && originalCheckData.userPhone.trim().length == 10 ? originalCheckData.userPhone.trim() : false;
    originalCheckData.url = typeof (originalCheckData.url) == 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim() : false;
    originalCheckData.protocol = typeof (originalCheckData.protocol) == 'string' && ['http', 'https'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol : false;
    originalCheckData.method = typeof (originalCheckData.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method : false;
    originalCheckData.successCodes = typeof (originalCheckData.successCodes) == 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ? originalCheckData.successCodes : false;
    originalCheckData.timeoutSeconds = typeof (originalCheckData.timeoutSeconds) == 'number' && originalCheckData.timeoutSeconds % 1 == 0 && originalCheckData.timeoutSeconds >= 1 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds : false;

    //Set the keys that may not be set (if the worker have never seen this check before)
    originalCheckData.state = typeof (originalCheckData.state) == 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down';
    originalCheckData.lastChecked = typeof (originalCheckData.lastChecked) == 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;
    // console.log(originalCheckData);
    //If all the checks passed , pass the data along to the next step in the process
    if (originalCheckData.id &&
        originalCheckData.userPhone &&
        originalCheckData.url &&
        originalCheckData.method &&
        originalCheckData.timeoutSeconds &&
        originalCheckData.successCodes &&
        originalCheckData.protocol
    ) {
        workers.performCheck(originalCheckData);
    } else {
        debug('Error : One of the checks is not properly formatted. Skippit it');
    }
};

// Perform the Check, send he originalcheck data and the outcome of the check process to the next step;
workers.performCheck = function (originalCheckData) {
    //Prepare the initial check outcome
    let checkOutcome = {
        'error': false,
        'responseCode': false
    };

    //Mark that the outcome has not been sent yet
    let outcomeSent = false;

    //Parse the hostname and the path out of the original check data
    let parsed = url.parse(originalCheckData.protocol + '://' + originalCheckData.url, true);
    let hostName = parsed.hostname;
    let path = parsed.path;
    // console.log(path, hostName);

    //Construct the request
    let requestDetails = {
        'protocol': originalCheckData.protocol + ':',
        'hostname': hostName,
        'method': originalCheckData.method.toUpperCase(),
        'path': path,
        'timeout': originalCheckData.timeoutSeconds * 1000,
    };

    // console.log(requestDetails);

    //Instantiate the request object (using either the http or https module)
    let _moduleToUse = originalCheckData.protocol == 'http' ? http : https;
    let req = _moduleToUse.request(requestDetails, function (res) {
        //Grab the status of the sent request
        let status = res.statusCode;
        // console.log(res);

        //Update the checkOutCome and pass the data along
        checkOutcome.responseCode = status;
        // console.log(checkOutcome);
        if (!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    //Bind to the error event so it doesnot get thrown
    req.on('error', function (e) {
        //Update the checkOutCome and pass the data along
        checkOutcome.error = {
            'error': true,
            'value': e
        };
        if (!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    //Bind to the timeout revent
    req.on('timeout', function (e) {
        //Update the checkOutCome and pass the data along
        checkOutcome.error = {
            'error': true,
            'value': 'timeout'
        };
        if (!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    // console.log(checkOutcome);

    //End the request
    req.end();
};

//Process the checkOutcome, update the check data as needed , trigger an alert if needed
//Special logic for accomodating a check that has never been tested before, no alerts

workers.processCheckOutcome = function (originalCheckData, checkOutcome) {
    // console.log(checkOutcome);
    //Decide if the check is considered up or down
    let state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

    //Decide if an alert is wanted
    let alertWanted = originalCheckData.lastChecked && originalCheckData.state != state ? true : false;

    //log the outcome
    let timeofCheck = Date.now();
    workers.log(originalCheckData, checkOutcome, state, alertWanted, timeofCheck);

    // Update the check data
    let newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = timeofCheck;

    //Save the update
    _data.update('checks', newCheckData.id, newCheckData, function (err) {
        if (!err) {
            if (alertWanted) {
                workers.alertUserToStatusChange(newCheckData);
            } else {
                debug('Check outcome has not changed, no alert needed');
            }
        } else {
            debug('Error trying to save update to one of the checks');
        }
    });
};

//alert the user as to a change to their status
workers.alertUserToStatusChange = function (newCheckData) {
    let msg = 'Alert : Your check for ' + newCheckData.method.toUpperCase() + ' ' + newCheckData.protocol + '://' + newCheckData.url + ' is currently ' + newCheckData.state;
    debug(msg);
    helpers.sendTwilioSms(newCheckData.userPhone, msg, function (err) {
        if (!err) {
            debug('Success : User was alerted to a status change in their check', msg);
        } else {
            debug('Error: Could not alert the user who had a status change in their check');
        }
    })
}


workers.log = function (originalCheckData, checkOutcome, state, alertWanted, timeofCheck) {
    //From the log data
    let logData = {
        'check' : originalCheckData,
        'outcome' : checkOutcome,
        'state' : state,
        'alert' : alertWanted,
        'time' : timeofCheck
    };

    //Convert data to string
    let logString = JSON.stringify(logData);

    //Determine the name of the log file
    let logFileName = originalCheckData.id;

    //Append the log string to the file
    _logs.append(logFileName, logString, function(err) {
        if(!err) {
            debug('Logging to the file succeed');
        }else {
            debug('Logging to file failed');
        }
    })
};

//Timer to execute the worker process once per minute
workers.loop = function () {
    setInterval(function () {
        workers.gatherAllChecks();
    }, 1000 * 60)
}

//Timer to execute the log-rotation process once a day
workers.logRotationLoop = function () {
    setInterval(function () {
        workers.rotateLogs();
    }, 1000 * 60 * 60 *24);
};

//Rotate (compress) the logs
 workers.rotateLogs = function() {
    //List all the non compressed log files
    _logs.list(false, function(err, logs) {
        // console.log('logs: ', logs);
        if(!err && logs && logs.length) {
            logs.forEach(function(logName) {
                // Compare the data to a different file
                let logId = logName.replace('.log', '');
                let newFileId = logId+'-'+Date.now();
                _logs.compress(logId, newFileId, function(err) {
                    if(!err) {
                        //Truncate the log
                        _logs.truncate(logId, function(err) {
                            if(!err) {
                                debug('Success truncating log file');
                            }else {
                                debug('Error truncating the log file');
                            }
                        })
                    }else {
                        debug('Error compressing one of the log files', err);
                    }
                })
            })
        }else {
            debug('Error : Could not find any logs to rotate');
        }
    })

 }

//Init script
workers.init = function () {

    console.log('\x1b[33m%s\x1b[0m', 'Backgroud workers are running');  //yellow

    //Execute all the checks immediatly
    workers.gatherAllChecks();

    //Call the loop the checks will execute later on
    workers.loop();

    //Compress all the logs immediately
    workers.rotateLogs();

    // Call the compression loop so logs will be compressed later on
    workers.logRotationLoop();
}


//Export the modules
module.exports = workers;