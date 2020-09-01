/**
 * Primary file for the API
 */

 //Dependencies

 let server = require('./lib/server');
 let workers = require('./lib/workers');
 let cli = require('./lib/cli');

 //Declare the app
 let app = {};

 //Initialization fuction
 app.init = function(callback) {
    //Strat the server
    server.init();

    //Start the workers
    workers.init();

    //Start the cli, but make sure it starts last
    setTimeout(() => {
       cli.init();
       callback();
    }, 50);
 };

 //Self invokinf only if required directly
 if(require.main === module) {
    app.init(function(){});
 }

 //Export the app
 module.exports = app;