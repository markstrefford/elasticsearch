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
 * Import rooms from JSON and insert into hotels
 */


// main bit of stuff!
// from http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/docs-update.html

console.log("Retrieving room " + roomsFile);
var roomsJson = JSON.parse(fs.readFileSync(roomsFile));
// Remove UTF encoding that somehow got into 700+ files!!
var cleanJson = JSON.parse(JSON.stringify(roomsJson).replace(/\uFEFF/, ''));
console.log(cleanJson);

// Create structure in the way I want it for the index
var roomJson = {
    "id" : cleanJson.id,
    "name" : cleanJson.name,

}
var roomId = cleanJson.ID;
var hotelID = cleanJson.HotelID;
if ( cleanJson.RackRate="NULL" ) cleanJson.RackRate=0;
console.log(JSON.stringify(cleanJson));

var updateJson = {"script": "ctx._source.room += room",
    "params": {
        "room": cleanJson
    }
}
console.log(JSON.stringify(updateJson));
// Add parent to URL
esParentUrl = esURL + "/" + hotelID + "/_update";
console.log("Posting to " + esParentUrl);
request.post(esParentUrl, {"body": JSON.stringify(updateJson)}, function (error, response, body) {
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