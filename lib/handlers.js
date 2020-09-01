/*
 *Request handlers
 */

//Dependencies
let _data = require('./data');
let helpers = require('./helpers');
let config = require('./config');
let _url = require('url');
let dns = require('dns');
// let { performance } = require('perf_hooks');
let {
    performance,
    PerformanceObserver
} = require('perf_hooks');
let util = require('util');
let debug = util.debuglog('performance');


//Define the handlers
let handlers = {};


/**
 * 
 * HTML handlers
 */

//Index handler
handlers.index = function (data, callback) {
    //Reject any request that isnot a get
    if (data.method == 'get') {
        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Uptime Monitaring - Made Simple',
            'head.description': 'We offer free, simple uptime monitoring for HTTP/HTTPS',
            'body.class': 'index'
        }

        // Read in a template as a string
        helpers.getTemplate('index', templateData, function (err, str) {
            // console.log(str);
            if (!err && str) {
                //Add the universal header and footer
                helpers.addUniversalTemplate(str, templateData, function (err, str) {
                    if (!err && str) {
                        // Return that page as HTMl
                        // console.log(str);

                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// Create account handler
handlers.accountCreate = function (data, callback) {
    //Reject any request that isnot a get
    if (data.method == 'get') {
        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Create an Account',
            'head.description': 'Signup is easy and takes few seconds.',
            'body.class': 'accountCreate'
        }

        // Read in a template as a string
        helpers.getTemplate('accountCreate', templateData, function (err, str) {
            // console.log(str);
            if (!err && str) {
                //Add the universal header and footer
                helpers.addUniversalTemplate(str, templateData, function (err, str) {
                    if (!err && str) {
                        // Return that page as HTMl
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// Create new sesson
handlers.sessionCreate = function (data, callback) {
    //Reject any request that isnot a get
    if (data.method == 'get') {
        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Login to your account',
            'head.description': 'Please enter your phone and password to access your account',
            'body.class': 'sessionCreate'
        }

        // Read in a template as a string
        helpers.getTemplate('sessionCreate', templateData, function (err, str) {
            // console.log(str);
            if (!err && str) {
                //Add the universal header and footer
                helpers.addUniversalTemplate(str, templateData, function (err, str) {
                    if (!err && str) {
                        // Return that page as HTMl
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// sesson deleted
handlers.sessionDeleted = function (data, callback) {
    //Reject any request that isnot a get
    if (data.method == 'get') {
        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Logged out',
            'head.description': 'You have been logged out',
            'body.class': 'sessionDeleted'
        }
        // Read in a template as a string
        helpers.getTemplate('sessionDeleted', templateData, function (err, str) {
            // console.log(str);
            if (!err && str) {
                //Add the universal header and footer
                helpers.addUniversalTemplate(str, templateData, function (err, str) {
                    if (!err && str) {
                        // Return that page as HTMl
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// Edit your account
handlers.accountEdit = function (data, callback) {
    //Reject any request that isnot a get
    if (data.method == 'get') {
        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Account Seetings',
            'body.class': 'accountEdit'
        }
        // Read in a template as a string
        helpers.getTemplate('accountEdit', templateData, function (err, str) {
            // console.log(str);
            if (!err && str) {
                //Add the universal header and footer
                helpers.addUniversalTemplate(str, templateData, function (err, str) {
                    if (!err && str) {
                        // Return that page as HTMl
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// account has been deleted
handlers.accountDeleted = function (data, callback) {
    //Reject any request that is not a get
    if (data.method == 'get') {
        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Account Deleted',
            'head.description': 'Account has been deleted',
            'body.class': 'accountDeleted'
        }
        // Read in a template as a string
        helpers.getTemplate('accountDeleted', templateData, function (err, str) {
            // console.log(str);
            if (!err && str) {
                //Add the universal header and footer
                helpers.addUniversalTemplate(str, templateData, function (err, str) {
                    if (!err && str) {
                        // Return that page as HTMl
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// Checks create
handlers.checksCreate = function (data, callback) {
    //Reject any request that is not a get
    if (data.method == 'get') {
        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Create Checks',
            'body.class': 'checksCreate'
        }
        // Read in a template as a string
        helpers.getTemplate('checksCreate', templateData, function (err, str) {
            // console.log(str);
            if (!err && str) {
                //Add the universal header and footer
                helpers.addUniversalTemplate(str, templateData, function (err, str) {
                    if (!err && str) {
                        // Return that page as HTMl
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// Checks list
handlers.checksList = function (data, callback) {
    //Reject any request that is not a get
    if (data.method == 'get') {
        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Dashboard',
            'body.class': 'checksList'
        }
        // Read in a template as a string
        helpers.getTemplate('checksList', templateData, function (err, str) {
            // console.log(str);
            if (!err && str) {
                //Add the universal header and footer
                helpers.addUniversalTemplate(str, templateData, function (err, str) {
                    if (!err && str) {
                        // Return that page as HTMl
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}

// Checks edit
handlers.checksEdit = function (data, callback) {
    //Reject any request that is not a get
    if (data.method == 'get') {
        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Checks Details',
            'body.class': 'checksEdit'
        }
        // Read in a template as a string
        helpers.getTemplate('checksEdit', templateData, function (err, str) {
            // console.log(str);
            if (!err && str) {
                //Add the universal header and footer
                helpers.addUniversalTemplate(str, templateData, function (err, str) {
                    if (!err && str) {
                        // Return that page as HTMl
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
}


// Favicon
handlers.favicon = function (data, callback) {
    //Reject any request that isn't a GET
    if (data.method == 'get') {
        helpers.getStaticAssets('favicon.ico', function (err, data) {
            if (!err && data) {
                // Callback the data
                callback(200, data, 'favicon');
            } else {
                callback(500);
            }
        });
    } else {
        callback(405);
    }
}

//Public assets
handlers.public = function (data, callback) {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        let trimmedAssetsName = data.trimmedPath.replace('public/', '').trim();
        // console.log(trimmedAssetsName);
        if (trimmedAssetsName.length > 0) {
            // Read in tha asset's data
            helpers.getStaticAssets(trimmedAssetsName, function (err, data) {
                if (!err && data) {
                    // console.log(data);
                    // Determine the content type (default to plain text);
                    let contentType = 'plain';

                    if (trimmedAssetsName.indexOf('.css') > -1) {
                        contentType = 'css';
                    }

                    if (trimmedAssetsName.indexOf('.png') > -1) {
                        contentType = 'png';
                    }

                    if (trimmedAssetsName.indexOf('.jpg') > -1) {
                        contentType = 'jpg';
                    }

                    if (trimmedAssetsName.indexOf('.ico') > -1) {
                        contentType = 'favicon';
                    }

                    // Callback the data
                    callback(200, data, contentType);

                } else {
                    callback(404);
                }
            })
        } else {
            callback(404);
        }
    } else {
        callback(405);
    }
}

/**
 * 
 * JSON API handlers
 */


handlers.exampleError = function (data, callback) {
    let err = new Error('This is an example error');
    throw (err);
}

//users
handlers.users = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
}

//Container for the users submethods
handlers._users = {};

//users -post
//Required data : firstName, lastName, phone, password, tosAgreement
//Optional data :none
handlers._users.post = function (data, callback) {
    //Check that all required field are filled out
    // console.log(data);
    var firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length > 0 ? data.payload.phone.trim() : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
    // console.log(typeof(data.payload.tosAgreement));
    // console.log(firstName, lastName, lastName, phone, password, tosAgreement);
    if (firstName && lastName && phone && password && tosAgreement) {
        //Make sure that the user doesnot exit already
        _data.read('users', phone, function (err, data) {
            if (err) {
                //Hash the password
                let hashedPassword = helpers.hash(password);
                if (hashedPassword) {
                    //Create the user object
                    let userObject = {
                        'firstName': firstName,
                        'lastName': lastName,
                        'phone': phone,
                        'hashedPassword': hashedPassword,
                        'tosAgreement': true,
                    }
                    //Store the User
                    _data.create('users', phone, userObject, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, {
                                'Error': 'Could not create the new User'
                            });
                        }
                    });
                } else {
                    callback(500, {
                        'Error': 'Could not hash the user\'s password'
                    });
                }
            } else {
                callback(400, {
                    'Error': 'User with that phone already exists'
                });
            }
        })
    } else {
        callback(400, {
            'Error': 'Missing required fields'
        });
    }
};

//users -get
//Required data :phone
//Optional data none
handlers._users.get = function (data, callback) {
    // Check that the phone no is valid
    let phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone : false;
    if (phone) {
        let token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
        handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
            if (tokenIsValid) {
                _data.read('users', phone, function (err, data) {
                    if (!err && data) {
                        //Remove the hashed password form the user obj before returning
                        delete data.hashedPassword;
                        callback(200, data);
                    } else {
                        callback(404);
                    }
                });
            } else {
                callback(403, {
                    'Error': 'Missing the required token, or Invalid token'
                });
            }
        })
    } else {
        callback(400, {
            'Error': 'Missing required field'
        });
    }
};

//users -put
//Required data : phone
//optional data : firstName, lastName
handlers._users.put = function (data, callback) {
    //Check for the required Field
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone : false;
    //Check for the optional field
    let firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (phone) {



        if (firstName || lastName || password) {
            let token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
            //verify the given token is valid for the phone number
            handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
                if (tokenIsValid) {
                    _data.read('users', phone, function (err, userData) {
                        if (!err) {
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lastName;
                            }
                            if (password) {
                                userData.hashedPassword = helpers.hash(password);
                            }
                            //Store the new update
                            _data.update('users', phone, userData, function (err) {
                                if (!err) {
                                    callback(200);
                                } else {
                                    // console.log(err);
                                    callback(500, {
                                        'Error': 'Could not update the user'
                                    });
                                }
                            })
                        } else {
                            callback(400, {
                                'Error': 'The user doesnot exit'
                            });
                        }
                    })
                } else {
                    callback(403, {
                        'Error': 'Missing the required token, or Invalid token'
                    });
                }
            });
        }
    } else {
        callback(400, {
            'Error': 'Missing required field'
        });
    }
};

//users -delete
//Required field : phone
handlers._users.delete = function (data, callback) {
    // Check that the phone no is valid
    let phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone : false;
    if (phone) {
        let token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
        // console.log(phone, token);
        handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
            if (tokenIsValid) {
                _data.read('users', phone, function (err, data) {
                    // console.log(err, data);
                    if (!err && data) {
                        _data.delete('users', phone, function (err) {
                            if (!err) {
                                //Delete all the checks associated with the checks
                                let userChecks = typeof (data.checks) == 'object' && data.checks instanceof Array ? data.checks : [];
                                let checksToDelete = userChecks.length;
                                if (checksToDelete > 0) {
                                    let checkDeleted = 0
                                    let deletionErrors = false;
                                    //Loop through the checks
                                    userChecks.forEach(function (checkId) {
                                        _data.delete('checks', checkId, function (err) {
                                            if (err) {
                                                deletionErrors = true;
                                            }
                                            checkDeleted++
                                            if (checkDeleted == checksToDelete) {
                                                if (!deletionErrors) {
                                                    callback(200);
                                                } else {
                                                    callback(500, {
                                                        'Error': 'Error encountered while attemping to delete the checks, all checks may not have deleted successfully'
                                                    });
                                                }
                                            }
                                        })
                                    })
                                } else {
                                    callback(200, "No check found");
                                }
                            } else {
                                callback(500, {
                                    'Error': 'Could not delete the user'
                                });
                            }
                        })
                    } else {
                        callback(400, {
                            'Error': 'Could not find the user'
                        });
                    }
                });
            } else {
                callback(403, {
                    'Error': 'Missing the required token, or Invalid token'
                });
            }
        })
    } else {
        callback(400, {
            'Error': 'Missing required field'
        });
    }
};

//tokens
handlers.tokens = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
}

//Container for all the tokens mathods

handlers._tokens = {};

//Token -post
//Required data - password, phone
//optionals data - none
handlers._tokens.post = function (data, callback) {
    performance.mark('entered function');
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length > 0 ? data.payload.phone.trim() : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    performance.mark('inputs validated');
    if (phone && password) {
        performance.mark('beginning user lookup');

        _data.read('users', phone, function (err, userData) {
            performance.mark('user lookup complete');

            // console.log(err, userData);
            if (!err && userData) {
                performance.mark('beginning password hashing');

                let hashedPassword = helpers.hash(password);
                performance.mark('password hashing complete');

                if (hashedPassword == userData.hashedPassword) {
                    //create a new token with random name. set exp of 1 hour
                    performance.mark('creating data for doken');

                    let tokenId = helpers.createRandomString(20);
                    let expires = Date.now() + 1000 * 60 * 60;
                    let tokenObject = {
                        'phone': phone,
                        'id': tokenId,
                        'expires': expires
                    };

                    // Store the token
                    performance.mark('beginning storing token');

                    _data.create('tokens', tokenId, tokenObject, function (err) {
                        performance.mark('storing token complete');

                        // Gather all the mesurement
                        performance.measure('Beginning to end', 'entered function', 'storing token complete');
                        performance.measure('Validating user inputs', 'entered function', 'inputs validated');
                        performance.measure('User lookup', 'beginning user lookup', 'user lookup complete');
                        performance.measure('Password hashing', 'beginning password hashing', 'password hashing complete');
                        performance.measure('Token data creation', 'creating data for token', 'beginning storing token');
                        performance.measure('Token storing', 'beginning storing token', 'storing token complete');


                        // FUNCTION BELOW getEntriesByType not working / it may be removed form node js in newer version

                        // Log out all the mesurement
                        // let mesurements = performance.getEntriesByType('measure');
                        // mesurements.forEach(function (mesurement) {
                        //     debug('\x1b[33m%s\x1b[0m', mesurement.name+' '+mesurement.duration); //yellow
                        // });



                        /** NOT WORKING PerformanceObserver BELOW*/
                        const observer = new PerformanceObserver((measurements) => {
                            measurements.getEntries().forEach((measurement) => {
                                console.log(measurement);
                                debug('\x1b[33m%s\x1b[0m', measurement.name + ': ' + measurement.duration);
                            });
                        });
                        observer.observe({
                            entryTypes: ['measure']
                        });
                        /** NOT WORKING UP */


                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {
                                'Error': 'Could not create the new token'
                            });
                        }
                    })
                } else {
                    callback(400, {
                        'Error': 'password didnot match'
                    });
                }
            } else {
                callback(400, {
                    'Error': 'Could not find the specified user'
                })
            }
        })
    } else {
        callback(400, {
            'Error': 'Missing required field'
        })
    }
}

//Token -get
//Required data - id
//Optional data -none
handlers._tokens.get = function (data, callback) {
    let id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id : false;
    if (id) {
        _data.read('tokens', id, function (err, tokenData) {
            if (!err && tokenData) {
                callback(200, tokenData);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, {
            'Error': 'Missing required field'
        });
    }
}

//Token -put
//Required data : id, extend should be true 
//Optional data : none
handlers._tokens.put = function (data, callback) {
    let id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id : false;
    let extend = typeof (data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
    if (id && extend) {
        _data.read('tokens', id, function (err, tokenData) {
            if (!err && tokenData) {
                //Check to ake syre the token doesnot expiress
                if (tokenData.expires > Date.now()) {
                    tokenData.expires = Date.now() + 1000 * 60 * 60;
                    _data.update('tokens', id, tokenData, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, {
                                'Error': 'Could not update the token'
                            })
                        }
                    })
                } else {
                    callback(400, {
                        'Error': 'Token is expired'
                    });
                }
            } else {
                callback(400, {
                    'Error': 'Token doesnot exits'
                });
            }
        })
    } else {
        callback(400, {
            'Error': 'Missing Required fields or fields are invalid'
        });
    }
}

//Token -delete
//Required data : id
//Optional dara : none
handlers._tokens.delete = function (data, callback) {
    //Checkng the Id is valid
    let id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id : false;
    if (id) {
        _data.read('tokens', id, function (err, tokenData) {
            if (!err) {
                _data.delete('tokens', id, function (err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {
                            'Error': 'Could not delete the token'
                        });
                    }
                })
            } else {
                callback(404, {
                    'Error': 'Token not found'
                });
            }
        })
    } else {
        callback(400, {
            'Error': 'Missing the required field'
        });
    }
}

//Verify if the given token id is currently valid for the given user
handlers._tokens.verifyToken = function (id, phone, callback) {
    _data.read('tokens', id, function (err, tokenData) {
        if (!err) {
            if (tokenData.phone == phone && tokenData.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    })
}

//Checks
handlers.checks = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._checks[data.method](data, callback);
    } else {
        callback(405);
    }
}

//Container for all the checks methods
handlers._checks = {};

//Checks - post method
//Required data : protocol, url, method, successCodes, timeoutSeconds
//Optional data : none
handlers._checks.post = function (data, callback) {
    //Validate all the inputs
    let protocol = typeof (data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    let method = typeof (data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    let url = typeof (data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    let timeoutSeconds = typeof (data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 == 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;
    let successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    // console.log(protocol, method, url, timeoutSeconds, successCodes);
    if (protocol && method && url && timeoutSeconds && successCodes) {
        //Get the token from the header
        let token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        //Look up user by reading the token
        _data.read('tokens', token, function (err, tokenData) {
            if (!err && tokenData) {
                let userPhone = tokenData.phone;
                //Look up the user data
                _data.read('users', userPhone, function (err, userData) {
                    if (!err && userData) {
                        let userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                        //Verify user have less than max-checks
                        if (userChecks.length < config.maxChecks) {
                            // Verify that the Url given has DNS entries (thefore can resolve)
                            let parseUrl = _url.parse(protocol + '://' + url, true);
                            let hostName = typeof (parseUrl.hostname) == 'string' && parseUrl.hostname.length > 0 ? parseUrl.hostname : false;
                            // console.log(hostName);

                            if (hostName) {
                                dns.resolve(hostName, function (err, records) {
                                    if (!err && records) {

                                        //Create a random id for the checks
                                        let checkId = helpers.createRandomString(20);

                                        //Create the check obj and includes the user phone
                                        let checkObject = {
                                            'id': checkId,
                                            'userPhone': userPhone,
                                            'protocol': protocol,
                                            'url': url,
                                            'method': method,
                                            'successCodes': successCodes,
                                            'timeoutSeconds': timeoutSeconds
                                        };
                                        //Save the obj
                                        _data.create('checks', checkId, checkObject, function (err) {
                                            if (!err) {
                                                // add the check id user's obj
                                                userData.checks = userChecks;
                                                userData.checks.push(checkId);

                                                //Save the new user data
                                                _data.update('users', userPhone, userData, function (err) {
                                                    if (!err) {
                                                        callback(200, checkObject);
                                                    } else {
                                                        callback(500, {
                                                            'Error': 'Could not update the user with the check'
                                                        });
                                                    }
                                                })
                                            } else {
                                                callback(500, {
                                                    'Error': 'Could not crate new checks'
                                                });
                                            }
                                        })
                                    } else {
                                        callback(400, {
                                            'Error': 'The hostname fo url did not resolve any DNS entries'
                                        });
                                    }
                                })
                            }

                        } else {
                            callback(400, {
                                'Error': 'Already have max no of checks ie ' + config.maxChecks
                            });
                        }
                    } else {
                        callback(403);
                    }
                })
            } else {
                callback(403);
            }
        })
    } else {
        callback(400, {
            'Error': 'Inputs are required, or are invalid'
        });
    }
}

//Checks - get
//Required  data : tokenId
//Optional data : none
handlers._checks.get = function (data, callback) {
    // Check that the phone no is valid
    let id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id : false;

    if (id) {
        //Look up the check
        _data.read('checks', id, function (err, checkData) {
            if (!err && checkData) {
                let token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
                //verify that the given token is valid and belongs to the user who crated
                handlers._tokens.verifyToken(token, checkData.userPhone, function (tokenIsValid) {
                    if (tokenIsValid) {
                        //return the check data
                        callback(200, checkData);
                    } else {
                        callback(403);
                    }
                })
            } else {
                callback(404);
            }
        })
    } else {
        callback(400, {
            'Error': 'Missing required field'
        });
    }
};

//Check - put method
//Required data : id
//Optional data : protocal, url, mrthods, successCodes, timeoutSeconds
handlers._checks.put = function (data, callback) {
    //Check for the required Field
    let id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id : false;
    //Check for the optional field
    let protocol = typeof (data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    let method = typeof (data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    let url = typeof (data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    let timeoutSeconds = typeof (data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 == 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;
    let successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;

    if (id) {
        //Check one or multiple fields has been send
        if (protocol || method || url || timeoutSeconds || successCodes) {
            _data.read('checks', id, function (err, checkData) {
                if (!err && checkData) {
                    let token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
                    //verify that the given token is valid and belongs to the user who crated
                    handlers._tokens.verifyToken(token, checkData.userPhone, function (tokenIsValid) {
                        if (tokenIsValid) {
                            //update the check
                            if (protocol) {
                                checkData.protocol = protocol;
                            }
                            if (url) {
                                checkData.url = url;
                            }
                            if (method) {
                                checkData.method = method;
                            }
                            if (successCodes) {
                                checkData.successCodes = successCodes;
                            }
                            if (timeoutSeconds) {
                                checkData.timeoutSeconds = timeoutSeconds;
                            }
                            //Store the new check data
                            _data.update('checks', id, checkData, function (err) {
                                if (!err) {
                                    callback(200);
                                } else {
                                    callback(500, {
                                        'Error': 'Check could not update'
                                    });
                                }
                            })
                        } else {
                            callback(403);
                        }
                    })
                } else {
                    callback(400, {
                        'Error': 'Check id doesnot exits'
                    });
                }
            })
        } else {
            callback(400, {
                'Error': 'Missinig field to update'
            });
        }
    } else {
        callback(400, {
            'Error': 'Missing required field'
        });
    }

};


//Check - delete
//Required data : id
//Optional data : none;
handlers._checks.delete = function (data, callback) {
    // Check that the id is valid
    let id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id : false;
    if (id) {

        //Lookup the check
        _data.read('checks', id, function (err, checkData) {
            if (!err && checkData) {
                let token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
                handlers._tokens.verifyToken(token, checkData.userPhone, function (tokenIsValid) {
                    if (tokenIsValid) {
                        //Delete the Check data
                        _data.delete('checks', id, function (err) {
                            if (!err) {
                                //Lookup the user
                                _data.read('users', checkData.userPhone, function (err, userData) {
                                    if (!err && userData) {
                                        let userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];

                                        //Remove the deleted checks form the check
                                        let checkPosition = userChecks.indexOf(id);
                                        if (!checkPosition > -1) {
                                            userChecks.splice(checkPosition, 1);
                                            //Re-save the user data
                                            _data.update('users', checkData.userPhone, userData, function (err) {
                                                if (!err) {
                                                    callback(200);
                                                } else {
                                                    callback(500, {
                                                        'Error': 'Could not update the user'
                                                    });
                                                }
                                            })
                                        } else {
                                            callback(500, {
                                                'Error': 'Could not find the check on the user data'
                                            });
                                        }


                                    } else {
                                        callback(400, {
                                            'Error': 'Could not find the user who created the check'
                                        });
                                    }
                                });
                            } else {
                                callback(500, {
                                    'Error': 'Could not delete the check'
                                })
                            }
                        })
                    } else {
                        callback(403, {
                            'Error': 'Missing the required token, or Invalid token'
                        });
                    }
                })
            } else {
                callback(400, {
                    'Error': 'The check id doesnot exits'
                });
            }
        })


    } else {
        callback(400, {
            'Error': 'Missing required field'
        });
    }
};


//ping handler
handlers.ping = function (data, callback) {
    //callback a http status code, and a payload object
    callback(201);
};

//Not found handlers
handlers.notFound = function (data, callback) {
    callback(404);
};

module.exports = handlers;