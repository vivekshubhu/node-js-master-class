/*
 *Helpers for various tasks
 */

//Dependencies
var crypto = require('crypto');
let config = require('./config');
let https = require('https');
let queryString = require('querystring');
let path = require('path');
let fs = require('fs');


let helpers = {};


// Sample for the testing that simply returns number
helpers.getNumber = function() {
    return 1;
}


////Create a SHA256 hash
helpers.hash = function (str) {
    if (typeof (str) == 'string' && str.length > 0) {
        let hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false
    }
}


// Parse a json string to an object in all cases
helpers.parseJsonToObject = function (str) {
    try {
        let obj = JSON.parse(str);
        return obj;
    } catch (e) {
        return {};
    }
}

//Create a string of random character
helpers.createRandomString = function (strLength) {
    strLength = typeof (strLength) == 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
        //Define all the possible characters that coould go into the string
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        //Start the final string
        let str = '';
        for (i = 1; i <= strLength; i++) {
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            str += randomCharacter;
        }
        return str;
    } else {
        return false;
    }
}

/** this method not working, get 400 status in every call */
//Send an sms via Twilio
//Required data : phone, mesage
helpers.sendTwilioSms = function (phone, msg, callback) {
    //Validate the parameters
    phone = typeof (phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false;
    msg = typeof (msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;

    if (phone && msg) {
        //Configure the request payload
        let payload = {
            'From': config.twilio.fromPhone,
            'To': '977' + phone,
            'Body': msg
        }

        //Stringify the payload
        let stringPayload = queryString.stringify(payload);

        //Configure the request details
        let requestDetails = {
            'protocol': 'https:',
            'hostname': 'api.twilio.com',
            'method': 'POST',
            'path': '/2010-04-01/Accounts/' + config.twilio.accoundSid + '/Messages.json',
            'auth': config.twilio.accoundSid + ':' + config.twilio.authToken,
            'headers': {
                'Content-type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringPayload),
            }
        }

        //Instantiate the request object
        let req = https.request(requestDetails, function (res) {
            //Grab the status of the sent requeest
            // console.log(res);
            let status = res.statusCode;
            //Callback successfully if the reques went through
            if (status == 200 || status == 201) {
                callback(false);
            } else {
                callback('Status code returned was ' + status);
            }
        });

        //Bind to the error event so it doesnot get thrown
        req.on('error', function (e) {
            callback(e);
        });

        //Add the payload
        req.write(stringPayload);

        //End the request
        req.end();
    } else {
        callback('Given parameter are missing or invalid');
    }
}

// Get the string content of a template
helpers.getTemplate = function (templateName, data, callback) {
    templateName = typeof (templateName) == 'string' && templateName.length > 0 ? templateName : false;
    data = typeof (data) == 'object' && data != null ? data : {};

    if (templateName) {
        let templateDir = path.join(__dirname, '/../templates/');
        fs.readFile(templateDir + templateName + '.html', 'utf8', function (err, str) {
            if (!err && str && str.length > 0) {
                //Do interpolation on the string
                let finalString = helpers.interpolate(str, data);
                callback(false, finalString);
            } else {
                callback('No template could be found');
            }
        })
    } else {
        callback('A valid template name was the specified');
    }
};

// Add the universal header and footer to a string and pass the provided data object to the header and footer for interpotion
helpers.addUniversalTemplate = function (str, data, callback) {
    str = typeof (str) == 'string' && str.length > 0 ? str : '';
    data = typeof (data) == 'object' && data != null ? data : {};
    // Get the header
    helpers.getTemplate('_header', data, function (err, headerString) {
        if (!err && headerString) {
            //Get the footer
            helpers.getTemplate('_footer', data, function (err, footerString) {
                if (!err && footerString) {
                    // Add them all together
                    let fullString = headerString + str + footerString;
                    callback(false, fullString);
                } else {
                    callback('Could not find the header template');
                }
            });
        } else {
            callback('Could not find the header template');
        }
    })
}

// Take a given string and a data object and find/replace all the keys with it
helpers.interpolate = function (str, data) {
    str = typeof (str) == 'string' && str.length > 0 ? str : '';
    data = typeof (data) == 'object' && data != null ? data : {};

    // Add the templateGlobal do the data object, prepending their key name with the global
    for (let keyName in config.templateGlobal) {
        if (config.templateGlobal.hasOwnProperty(keyName)) {
            data['global.' + keyName] = config.templateGlobal[keyName];
        }
    }

    //or each key in data obj. insert its value into te string at the corresponding placeholder
    for (let key in data) {
        if (data.hasOwnProperty(key) && typeof (data[key]) == 'string') {
            // console.log(data[key]);
            let replace = data[key];
            let find = '{' + key + '}';
            str = str.replace(find, replace);
        }
    }
    return str;
}

// Get the contents of the static (public) assets

helpers.getStaticAssets = function(fileName, callback) {
    fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;
    if(fileName) {
        let publicDir = path.join(__dirname, '/../public/');
        // console.log(publicDir);
        fs.readFile(publicDir+fileName, function(err, data) {
            // console.log(data);
            if(!err && data) {
                callback(false, data);
            }else {
                callback('No file could be found');
            }
        });
    }else {
        callback('A valid filename was the specified');
    }
}


//Export the helper
module.exports = helpers;