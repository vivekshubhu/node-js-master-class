/**
 * 
 * CLI-related tasks
 */
//Dependencies
let readline = require('readline');
let util = require('util');
let debug = util.debuglog('cli');
let events = require('events');
let os = require('os');
let v8 = require('v8');
let _data = require('./data');
let _logs = require('./logs');
let helpers = require('./helpers');
const {
    type
} = require('os');
class _events extends events {};
let e = new _events;

// Instantiate the CLI module object
let cli = {};


// Input handlers
e.on('man', function (str) {
    cli.responders.help();
});

e.on('help', function (str) {
    cli.responders.help();
});

e.on('exit', function (str) {
    cli.responders.exit();
});

e.on('stats', function (str) {
    cli.responders.stats();
});

e.on('list users', function (str) {
    cli.responders.listUsers();
});

e.on('more user info', function (str) {
    cli.responders.moreUserInfo(str);
});

e.on('list checks', function (str) {
    cli.responders.listChecks(str);
});

e.on('more check info', function (str) {
    cli.responders.moreCheckInfo(str);
});

e.on('list logs', function (str) {
    cli.responders.listLogs();
});

e.on('more log info', function (str) {
    cli.responders.moreLogInfo(str);
});



// Responders object
cli.responders = {};

// Help / man
cli.responders.help = function () {
    let commands = {
        'exit': 'Kill the CLI (and the rest of the application)',
        'man': 'Show this help page',
        'help': 'Alias of the "man" command',
        'stats': 'Get statistics on the underlying operating system and resource utilization',
        'List users': 'Show a list of all the registered (undeleted) users in the system',
        'More user info --{userId}': 'Show details of a specified user',
        'List checks --up --down': 'Show a list of all the active checks in the system, including their state. The "--up" and "--down flags are both optional."',
        'More check info --{checkId}': 'Show details of a specified check',
        'List logs': 'Show a list of all the log files available to be read (compressed only)',
        'More log info --{logFileName}': 'Show details of a specified log file',
    };

    // Show the header for the help page
    cli.horizontalLine();
    cli.centered('CLI MANNUAl');
    cli.horizontalLine();
    cli.verticalSpace(1);

    // Show each command, followed by its explanation
    for (let key in commands) {
        if (commands.hasOwnProperty(key)) {
            let value = commands[key];
            let line = '\x1b[33m' + key + '\x1b[0m';
            let padding = 60 - line.length;
            for (i = 0; i < padding; i++) {
                line += ' ';
            }
            line += value;
            console.log(line);
            cli.verticalSpace(1);
        }
    }
    cli.verticalSpace(1);
    cli.horizontalLine();
}

//Create a vertical space
cli.verticalSpace = function (lines) {
    lines = typeof (lines) == 'number' && lines > 0 ? lines : 1;
    for (i = 0; i < lines; i++) {
        console.log('');
    };
}

// Create horizontal line
cli.horizontalLine = function () {
    // Get the available screen size
    let width = process.stdout.columns;
    // console.log(width);
    let lines = '';
    for (i = 0; i < width; i++) {
        lines += '-';
    }
    console.log(lines);
}

// Create centered text on screen
cli.centered = function (str) {
    str = typeof (str) == 'string' && str.trim().length > 0 ? str.trim() : '';

    //Get the available scren size
    let width = process.stdout.columns;

    // Calculate the left padding 
    let leftPdding = Math.floor(width - str.length) / 2;

    let line = '';

    for (i = 0; i < leftPdding; i++) {
        line += ' ';
    }
    line += str;
    console.log(line);

}


// Exit
cli.responders.exit = function () {
    console.log('\x1b[31m%s\x1b[0m', 'Goodbye');
    process.exit(0);
}

// stats
cli.responders.stats = function () {
    // Compile  an object of start
    let stats = {
        'Load Average': os.loadavg().join(' '),
        'CPU Count': os.cpus().length,
        'Free Memory': os.freemem(),
        'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
        'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
        'Allocated Heap Used (%)': Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
        'Available Heap Allocated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
        'Uptime': os.uptime() + ' Seconds'
    };

    // Show the header for the stat page
    cli.horizontalLine();
    cli.centered('SYSTEM STATISTICS');
    cli.horizontalLine();
    cli.verticalSpace(1);

    // log out the stats
    for (let key in stats) {
        if (stats.hasOwnProperty(key)) {
            let value = stats[key];
            let line = '\x1b[33m' + key + '\x1b[0m';
            let padding = 60 - line.length;
            for (i = 0; i < padding; i++) {
                line += ' ';
            }
            line += value;
            console.log(line);
            cli.verticalSpace(1);
        }
    }
    cli.verticalSpace(1);
    cli.horizontalLine();

}

// list users
cli.responders.listUsers = function () {
    _data.list('users', function (err, userIds) {
        if (!err && userIds && userIds.length > 0) {
            cli.verticalSpace();
            userIds.forEach(function (userId) {
                _data.read('users', userId, function (err, userData) {
                    if (!err && userData) {
                        var line = 'Name: ' + userData.firstName + ' ' + userData.lastName + ' Phone: ' + userData.phone + ' Checks: ';
                        var numberOfChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0;
                        line += numberOfChecks;
                        console.log(line);
                        cli.verticalSpace();
                    }
                });
            })
        }
    })
}

// more user info
cli.responders.moreUserInfo = function (str) {
    // Get the Id from the str
    let arr = str.split('--');
    let userId = typeof (arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1] : false;

    if (userId) {
        _data.read('users', userId, function (err, userData) {
            if (!err && userData) {
                delete userData.hashedPassword;

                cli.verticalSpace();
                console.log(userData);
                cli.verticalSpace();
            }
        })
    }
}

// list checks
cli.responders.listChecks = function (str) {
    _data.list('checks', function (err, checkIds) {
        if (!err && checkIds && checkIds.length > 0) {
            cli.verticalSpace();
            checkIds.forEach(function (checkId) {
                _data.read('checks', checkId, function (err, checkData) {
                    if (!err && checkData) {
                        var includeCheck = false;
                        var lowerString = str.toLowerCase();
                        // Get the state, default to down
                        var state = typeof (checkData.state) == 'string' ? checkData.state : 'down';
                        // Get the state, default to unknown
                        var stateOrUnknown = typeof (checkData.state) == 'string' ? checkData.state : 'unknown';
                        // If the user has specified that state, or hasn't specified any state
                        if ((lowerString.indexOf('--' + state) > -1) || (lowerString.indexOf('--down') == -1 && lowerString.indexOf('--up') == -1)) {
                            var line = 'ID: ' + checkData.id + ' ' + checkData.method.toUpperCase() + ' ' + checkData.protocol + '://' + checkData.url + ' State: ' + stateOrUnknown;
                            console.log(line);
                            cli.verticalSpace();
                        }
                    }
                });
            });
        }
    });
}

// more check info
cli.responders.moreCheckInfo = function (str) {
    // Get ID from string
  var arr = str.split('--');
  var checkId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
  if(checkId){
    // Lookup the user
    _data.read('checks',checkId,function(err,checkData){
      if(!err && checkData){

        // Print their JSON object with text highlighting
        cli.verticalSpace();
        console.dir(checkData,{'colors' : true});
        cli.verticalSpace();
      }
    });
  }
}

// more list logs
cli.responders.listLogs = function () {
    _logs.list(true,function(err,logFileNames){
        if(!err && logFileNames && logFileNames.length > 0){
          cli.verticalSpace();
          logFileNames.forEach(function(logFileName){
            if(logFileName.indexOf('-') > -1){
              console.log(logFileName);
              cli.verticalSpace();
            }
          });
        }
      });
}

// more check info
cli.responders.moreLogInfo = function (str) {
     // Get logFileName from string
  var arr = str.split('--');
  var logFileName = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
  if(logFileName){
    cli.verticalSpace();
    // Decompress it
    _logs.decompress(logFileName,function(err,strData){
      if(!err && strData){
        // Split it into lines
        var arr = strData.split('\n');
        arr.forEach(function(jsonString){
          var logObject = helpers.parseJsonToObject(jsonString);
          if(logObject && JSON.stringify(logObject) !== '{}'){
            console.dir(logObject,{'colors' : true});
            cli.verticalSpace();
          }
        });
      }
    });
  }
}

// Input processor
cli.processInput = function (str) {
    // console.log(str);
    str = typeof (str) == 'string' && str.trim().length > 0 ? str.trim() : false;
    // Only process the input if the user actually wrote something, otherwise ignore
    if (str) {
        // Codify theunique string that the unique question allowed to be asked
        let uniqueInputs = [
            'man',
            'help',
            'exit',
            'stats',
            'list users',
            'more user info',
            'list checks',
            'more check info',
            'list logs',
            'more log info'
        ];

        // Co through the possible inputs, emit an event when match found
        let matchFound = false;
        let counter = 0;
        uniqueInputs.some(function (input) {
            if (str.toLowerCase().indexOf(input) > -1) {
                matchFound = true;
                // Emit an event matching the unique input, include the full string
                e.emit(input, str);
                return true;
            }
        });

        // If no match id found,  tell the user to try again
        if (!matchFound) {
            console.log('Sorry, try again');
        }
    }
}

//Init script
cli.init = function () {
    //Send the start massage to the console, in dark blue
    console.log('\x1b[34m%s\x1b[0m', 'The CLI is running');

    // Start the interface
    let _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>'
    });

    // Create an initial promt
    _interface.prompt();

    //Handle each line of the input seprately
    _interface.on('line', function (str) {
        // Send the input processer
        cli.processInput(str);

        // Re-initialize the prompt afterwards
        _interface.prompt();
    });

    // If the user stops the CLI, kill the associatd process
    _interface.on('close', function () {
        process.exit(0);
    })

}




// Exports the module
module.exports = cli;