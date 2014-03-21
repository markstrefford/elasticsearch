#!/usr/bin/env node
if (process.argv.length != 4) {
    die('import room json into elastic search\n' +
        'usage: import_rooms <file_or_directory_to_import> <elasticsearch_url>');
}

/**
 * Import room data into elastic search
 */

// http://stackoverflow.com/questions/15121584/how-to-parse-a-large-newline-delimited-json-file-by-jsonstream-module-in-node-j
var fs = require('fs'),
    JSONStream = require('JSONStream'),
    _ = require('underscore'),
    request = require('request');


var roomsFile = process.argv[2],
    esURL = process.argv[3];

/*
 * Import rooms from JSON
 */


// main bit of stuff!

console.log("Retrieving room " + roomsFile);
var roomsJson = JSON.parse(fs.readFileSync(roomsFile));
// Remove UTF encoding that somehow got into 700+ files!!
var cleanJson = JSON.parse(JSON.stringify(roomsJson).replace(/\uFEFF/, ''));
console.log(cleanJson);
var roomId = cleanJson.ID;
var hotelID = cleanJson.HotelID;
// Add parent to URL
esParentUrl = esURL + "?parent=" + hotelID;
console.log("Posting to " + esParentUrl + roomId);
request.post(esParentUrl, {"body" : JSON.stringify(cleanJson)}, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body)
    } else {
        die(body);
    }
});


/* Halt execution with an error message. */
function die(message) {
    console.error(message);
    process.exit(1);
}