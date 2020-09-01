/**
 * Primary file for the API
 */

 //Dependencies

 let server = require('./lib/server');
 let workers = require('./lib/workers');
 let cli = require('./lib/cli');

 //Declare the app
 let app = {};

 //Declare a global (that strict mode should catch)
 foo = 'bar';

 //Initialization fuction
 app.init = function() {
    //Strat the server
    server.init();

    //Start the workers
    workers.init();

    //Start the cli, but make sure it starts last
    setTimeout(() => {
       cli.init();
    }, 50);
 };

 //Execute app
 app.init();

 //Export the app
 module.exports = app;