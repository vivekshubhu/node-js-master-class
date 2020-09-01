/**
 * Library for storing and rotating logs
 */

//Dependencies

let fs = require('fs');
let path = require('path');
let zlib = require('zlib');


let lib = {}

//Base dir of the log folder
lib.baseDir = path.join(__dirname, '/../.logs/');

// Append a string to a file, create the file if not exists
lib.append = function (file, str, callback) {
    // Open the file for appending
    fs.open(lib.baseDir + file + '.log', 'a', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
            //Append to the file and close it
            fs.appendFile(fileDescriptor, str + '\n', function (err) {
                if (!err) {
                    fs.close(fileDescriptor, function (err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing the file that was being appended');
                        }
                    })
                } else {
                    callback('Error appending the file');
                }
            });
        } else {
            callback('Could not open file for appending');
        }
    })
};

// List all the logs, and optionally include the compressed logs
lib.list = function (includeCompressedLogs, callback) {
    fs.readdir(lib.baseDir, function (err, data) {
        if (!err && data && data.length > 0) {
            let trimmedFileName = [];
            data.forEach(function (fileName) {
                //add the .log files
                if (fileName.indexOf('.log') > -1) {
                    trimmedFileName.push(fileName.replace('.log', ''));
                }

                // Add on the .gz files
                if (fileName.indexOf('.gz.b64') > -1 && includeCompressedLogs) {
                    trimmedFileName.push(fileName.replace('.gz.b64', ''));
                }
            });
            callback(false, trimmedFileName);
        } else {
            callback(err, data);
        }
    })
};

// Compressed the contents of one .log file into a .gz.b64 within the same dir
lib.compress = function (logId, newFileId, callback) {
    let sourceFile = logId + '.log';
    let destFile = newFileId + '.gz.b64';

    //Read the source file
    fs.readFile(lib.baseDir + sourceFile, 'utf8', function (err, inputString) {
        if (!err && inputString) {
            // console.log('inputString : ', inputString);
            // Compress the data useing gzip
            zlib.gzip(inputString, function (err, buffer) {
                if (!err && buffer) {
                    // console.log('buffer : ', buffer);
                    // Send the data to the destination file
                    fs.open(lib.baseDir + destFile, 'wx', function (err, fileDescriptor) {
                        if (!err && fileDescriptor) {
                            // Write to the destination file
                            fs.writeFile(fileDescriptor, buffer.toString('base64'), function (serr) {
                                if (!err) {
                                    // Closing the destination file
                                    fs.close(fileDescriptor, function (err) {
                                        if (err) {
                                            callback(false);
                                        } else {
                                            callback(err);
                                        }
                                    })
                                } else {
                                    callback(err);
                                }
                            });
                        } else {
                            callback(err);
                        }
                    });
                } else {
                    callback(err);
                }
            });
        } else {
            callback(err);
        }
    })
};

// Decompress the contents of a .gz.b64 file into a string variable
lib.decompress = function (fileId, callback) {
    let fileName = fileId + '.gz.b64';
    fs.readFile(lib.baseDir + fileName, 'utf8', function (err, str) {
        if (!err && str) {
            // Decompress the data
            let inputBuffer = Buffer.from(str, 'base64');
            zlib.unzip(inputBuffer, function (err, outputBuffer) {
                if (!err, outputBuffer) {
                    // Callback
                    let str = outputBuffer.toString();
                    callback(false, str);
                } else {
                    callback(err);
                }
            })
        } else {
            callback(err);
        }
    })
};

// Truncate the log file
lib.truncate = function(logId, callback) {
    fs.truncate(lib.baseDir+logId+'.log', 0, function(err) {
        if(!err) {
            callback(false);
        }else{
            callback(err);
        }
    })
}

//Exports the module
module.exports = lib;