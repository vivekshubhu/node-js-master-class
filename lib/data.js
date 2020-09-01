/*
*library for storing and editing data
*/

//Dependiencies
let fs = require('fs');
let path = require('path');
const helpers = require('./helpers');

//container for the module {to be exported}
let lib = {};

//Base dir of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

//Write data to a file
lib.create = function(dir, file, data, callback) {
    //Open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor) {
        // console.log(err, fileDescriptor);
        if(!err && fileDescriptor) {
            // Convert data to the string
            let stringData = JSON.stringify(data);

            //Write to the file and close it
            fs.writeFile(fileDescriptor, stringData, function(err) {
                if(!err) {
                    fs.close(fileDescriptor, function(err) {
                        if(!err) {
                            callback(false);
                        } else {
                            callback("Error closing new file");
                        }
                    })
                } else {
                    callback('Error writting to new file')
                }
            })
        }else {
            callback('Could not create the new file, it may already exits');
        }
    })
};

//Read data form a file
lib.read = function(dir, file, callback) {
    fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf8', function(err, data) {
        if(!err) {
           let parsedData = helpers.parseJsonToObject(data);
        //    console.log(parsedData);
           callback(false, parsedData);
        }else {
            // console.log(err);
            callback(err, data);
        }
    });
};

//Udate the data inside the file
lib.update = function(dir, file, data, callback) {
    //Open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', function(err, fileDescriptor) {
        if(!err && fileDescriptor) {
            // Convert data to the string
            let stringData = JSON.stringify(data);
            // Truncate the file
            fs.truncate(fileDescriptor, function(err) {
                if(!err) {
                    //Write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, function(err) {
                        if(!err) {
                            fs.close(fileDescriptor, function(err) {
                                if(!err) {
                                    callback(false);
                                }else {
                                    callback('Error closing the existing file');
                                }
                            })
                        } else {
                            callback('Error writing the existing file');
                        }
                    })
                }else {
                    callback('Error truncating the existing file');
                }
            })
        }else {
            callback('Could not open the file for updating, it may not exists yet');
        }
    });
}

//Delete a file;
lib.delete = function(dir, file, callback) {
    //Unlink the file
    fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err) {
        if(!err) {
            callback(false);
        }else {
            callback('Error deleting the file');
        }
    });
}

//List all the items in a directory
lib.list = function(dir, callback) {
    fs.readdir(lib.baseDir+dir+'/', function(err, data) {
        if(!err && data && data.length > 0) {
            let trimmedFileNames = [];
            data.forEach(function(fileName) {
                trimmedFileNames.push(fileName.replace('.json', ''));
            });
            callback(false, trimmedFileNames);
        }else {
            callback(err, data);
        }
    })
}

//Export the module
module.exports = lib;