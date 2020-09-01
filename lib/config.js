/*
*Create and export configuration variables
*/

//Container for all the environments
let environments = {};

//Staging {default} environment
environments.staging = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'staging',
    'hashingSecret' : 'thisIsASecret',
    'maxChecks' : 5,
    'twilio' : {
        'accoundSid' : 'ACb6830acc63843a05539a35266c46c6f4',
        'authToken' : 'a1d9b292bf29e32c1ab688a975d365b0',
        'fromPhone' : '9779864995686',
    },
    'templateGlobal' : {
        'appName' : 'UptimeChecker',
        'companyName' : 'NotARealCompany, Inc',
        'yearCreated' : '2018',
        'baseUrl' : 'http://localhost:3000'
    }
};

//Testing environment
environments.testing = {
    'httpPort' : 4000,
    'httpsPort' : 4001,
    'envName' : 'testing',
    'hashingSecret' : 'thisIsASecret',
    'maxChecks' : 5,
    'twilio' : {
        'accoundSid' : 'ACb6830acc63843a05539a35266c46c6f4',
        'authToken' : 'a1d9b292bf29e32c1ab688a975d365b0',
        'fromPhone' : '9779864995686',
    },
    'templateGlobal' : {
        'appName' : 'UptimeChecker',
        'companyName' : 'NotARealCompany, Inc',
        'yearCreated' : '2018',
        'baseUrl' : 'http://localhost:3000'
    }
};

//Production environment
environments.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'production',
    'hashingSecret' : 'thisIsAlsoASecret',
    'maxChecks' : 5,
    'twilio' : {
        'accoundSid' : 'ACb6830acc63843a05539a35266c46c6f4',
        'authToken' : 'a1d9b292bf29e32c1ab688a975d365b0',
        'fromPhone' : '9779864995686',
    },
    'templateGlobal' : {
        'appName' : 'UptimeChecker',
        'companyName' : 'NotARealCompany, Inc',
        'yearCreated' : '2018',
        'baseUrl' : 'https://localhost:5000'
    }
};

//Determine which env was passed as a command-line argument
let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//Check that the current environment is one of the environments above, if not, default to staging
let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

//Exports the module
module.exports = environmentToExport;

