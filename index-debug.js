/**
 * Primary file for the API
 */

 //Dependencies

 let server = require('./lib/server');
 let workers = require('./lib/workers');
 let cli = require('./lib/cli');
 let exampleDebuggingProblem = require('./lib/exampleDebuggingProblem');

 //Declare the app
 let app = {};

 //Initialization fuction
 app.init = function() {
    //Strat the server
    debugger;
    server.init();
    debugger;

    //Start the workers
    debugger;

    workers.init();
    debugger;

    debugger;

    //Start the cli, but make sure it starts last
    setTimeout(() => {
       cli.init();
    }, 50);
    debugger;


    //Set foo at 1

    let foo = 1;
    console.log('Just assigned 1 to foo');
    debugger;


    //Increment foo
    foo++
    console.log('Just increament the foo');
    debugger;

    //Square the foo
    foo = foo*foo;
    console.log('just square the foo');
    debugger;

    // convert foo to a string
    foo = foo.toString();
    console.log('just converted the foo to string');
    debugger;

    // Call the init script that will throw error
    exampleDebuggingProblem.init();
    console.log("just called the library");
    debugger;
 };

 //Execute app
 app.init();

 //Export the app
 module.exports = app;