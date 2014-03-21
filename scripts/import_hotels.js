#!/usr/bin/env node
if (process.argv.length != 4) {
    die('import hotel json into elastic search\n' +
        'usage: import_hotels <file_or_directory_to_import> <elasticsearch_url>');
}

/**
 * Import hotel data into elastic search
 */

// http://stackoverflow.com/questions/15121584/how-to-parse-a-large-newline-delimited-json-file-by-jsonstream-module-in-node-j
var fs = require('fs'),
    JSONStream = require('JSONStream'),
    _ = require('underscore'),
    request = require('request');


var hotelsFile = process.argv[2],
    esURL = process.argv[3];

/*
 * Import hotels from JSON
 */


// main bit of stuff!

console.log("Retrieving hotels " + hotelsFile);
var hotelsJson = JSON.parse(fs.readFileSync(hotelsFile));
// Remove UTF encoding that somehow got into 700+ files!!
var cleanJson = JSON.parse(JSON.stringify(hotelsJson).replace(/\uFEFF/, ''));
console.log(cleanJson);
var hotelId = cleanJson.ID;
if ( cleanJson.custrating="NULL" ) cleanJson.custrating=0;
console.log("Posting to " + esURL + hotelId);
request.post(esURL + hotelId, {"body" : JSON.stringify(cleanJson)}, function(error, response, body) {
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

