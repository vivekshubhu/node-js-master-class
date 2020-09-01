/*
 * Server related tasks
 */

//Dependencies
let http = require('http');
let https = require('https');
let url = require('url');
let StringDecoder = require('string_decoder').StringDecoder;
let config = require('./config');
let fs = require('fs');
let handlers = require('./handlers');
let helpers = require('./helpers');
let path = require('path');
let util = require('util');
const {
    type
} = require('os');
let debug = util.debuglog('server');

//TODO remmove this
helpers.sendTwilioSms('9860134237', 'hello', function (err) {
    if (!err) {
        debug('message is alerted');
    } else {
        debug(err);
    }
})

//Instantialte the server module object
let server = {};

//Instantiating the http server
server.httpServer = http.createServer(function (req, res) {
    server.unifiedServer(req, res);
});

//instantiating the https server
server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem')),
};
server.httpsServer = https.createServer(server.httpsServerOptions, function (req, res) {
    server.unifiedServer(req, res);
});

//all the server logic for both http and https serve
server.unifiedServer = function (req, res) {

    //get the url and parse it
    let parsedUrl = url.parse(req.url, true);
    //Get the path
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //Get the query string as an object
    let queryStringObject = parsedUrl.query;

    //Get the http Method
    var method = req.method.toLowerCase();

    //Get the headers as an object
    let headers = req.headers;

    //Get the payload, if any
    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end', function () {
        buffer += decoder.end();

        //choose the handler this request should go to
        let chosenHandler = typeof (server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;
        // If the request is within the public directory, use the public handler instead
        chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;

        // console.log(buffer);
        // console.log(helpers.parseJsonToObject(buffer));

        //construct the data object to send to the handler
        let data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        };

        try {
            //route the request to the handler specified in the router
            chosenHandler(data, function (statusCode, payload, contentType) {
                server.processHandlerResponse(res, method, trimmedPath, statusCode, payload, contentType)
            });
        } catch(e) {
            debug(e);
            server.processHandlerResponse(res, method, trimmedPath, 500, {'Error': 'An unknown error has occured'}, 'json')
        }
    });
}

// Process yhe respose from the handler
server.processHandlerResponse = function (res, method, trimmedPath, statusCode, payload, contentType) {
    //Determine the type of the response (default to json)
    contentType = typeof (contentType) == 'string' ? contentType : 'json';

    //use the status code called back by the handler, or default to 200
    statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

    //use the payload called back by the handler, or default to an empty object

    // console.log(statusCode, payload, contentType);

    //return the response parts that are content specific
    let payloadString = '';
    if (contentType == 'json') {
        res.setHeader('Content-Type', 'application/json');
        payload = typeof (payload) == 'object' ? payload : {};
        //convert the payload to the string
        payloadString = JSON.stringify(payload);
    }
    if (contentType == 'html') {
        res.setHeader('Content-Type', 'text/html');
        payloadString = typeof (payload) == 'string' ? payload : '';
    }

    if (contentType == 'favicon') {
        res.setHeader('Content-Type', 'image/x-icon');
        payloadString = typeof (payload) == 'string' ? payload : '';
    }

    if (contentType == 'css') {
        res.setHeader('Content-Type', 'text/css');
        payloadString = typeof (payload) != 'undefined' ? payload : '';
    }

    if (contentType == 'png') {
        // console.log('found');
        res.setHeader('Content-Type', 'text/png');
        payloadString = typeof (payload) != 'undefined' ? payload : '';
    }

    if (contentType == 'jpg') {
        res.setHeader('Content-Type', 'text/jpeg');
        payloadString = typeof (payload) != 'undefined' ? payload : '';
    }

    if (contentType == 'plain') {
        res.setHeader('Content-Type', 'text/plain');
        payloadString = typeof (payload) != 'undefined' ? payload : '';
    }


    //Return the response parts that are common to all req
    res.writeHead(statusCode);
    res.end(payloadString);

    //If the response is 200, print green else red
    if (statusCode == 200) {
        debug('\x1b[32m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode); //green
    } else {
        debug('\x1b[31m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode); //red
    }
}


//Define a request router
server.router = {
    '': handlers.index,
    'account/create': handlers.accountCreate,
    'account/edit': handlers.accountEdit,
    'account/deleted': handlers.accountDeleted,
    'session/create': handlers.sessionCreate,
    'session/deleted': handlers.sessionDeleted,
    'checks/all': handlers.checksList,
    'checks/create': handlers.checksCreate,
    'checks/edit': handlers.checksEdit,
    'ping': handlers.ping,
    'api/users': handlers.users,
    'api/checks': handlers.checks,
    'api/tokens': handlers.tokens,
    'favicon.ico': handlers.favicon,
    'public': handlers.public,
    'examples/error': handlers.exampleError
};

//Init scripts
server.init = function () {
    //Start the http server
    server.httpServer.listen(config.httpPort, function () {
        console.log('\x1b[36m%s\x1b[0m', 'the server is listening on httpPort ' + config.httpPort); //yellow
    });

    //Start the https server
    server.httpsServer.listen(config.httpsPort, function () {
        console.log('\x1b[35m%s\x1b[0m', 'the server is listening on httpsPort ' + config.httpsPort + ' in ' + config.envName + ' mode'); //yellow
    });
}

//Export the module
module.exports = server;