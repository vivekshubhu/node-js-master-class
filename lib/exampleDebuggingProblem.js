/**
 * 
 * Library that demostrate something throwing whrn it's init() is called
 */

 //Container for the module
 let example = {};

 //Init the function
 example.init = function() {
     //Thiis is an error created intentionally (bar is not defined);
     let foo = bar;
 }

 // Exports the module
 module.exports = example;