#!/usr/bin/env node
if (process.argv.length != 4) {
    die('import hotel json into elastic search\n' +
        'usage: import_hotels <directory_to_import_from> <elasticsearch_url>');
}

/**
 * Import hotel data into elastic search
 */

// http://stackoverflow.com/questions/15121584/how-to-parse-a-large-newline-delimited-json-file-by-jsonstream-module-in-node-j
var fs = require('fs'),
    JSONStream = require('JSONStream'),
    _ = require('underscore'),
    request = require('request');


var hotelsDir = process.argv[2],
    esURL = process.argv[3];

/*
 * Import hotels from JSON
 */

var hotelData = {};

var postToElasticSearch = function(json) {
    request.post(esURL + json.id, {"body": JSON.stringify(json)}, function (error, response, body) {
        if (error) {
            die(body);
        } else {
            console.log(body);
        }
    });
}

fs.readdir(hotelsDir, function (err, files) {
    if (err) throw err;
    var c = 0;
    files.forEach(function (file) {
        c++;
        fs.readFile(hotelsDir + file, 'utf-8', function (err, json) {
            if (err) throw err;
            //console.log(json);
            var hotelJson = JSON.parse(json);
            if (hotelJson.cust_rating = "NULL") hotelJson.cust_rating = 0;
            hotelJson.geo = [ parseFloat(hotelJson.lng), parseFloat(hotelJson.lat)];
            hotelJson.room = [];
            hotelJson.algorithm_score = 0;
            hotelJson.algorithm_nested = [];
            hotelData[hotelJson.id] = hotelJson;
            //console.log("Indexing " + JSON.stringify(hotelJson));
            postToElasticSearch(hotelJson);
            if (0 === --c) {
                console.log(hotelData);  //socket.emit('init', {data: data});
                console.log("Done!!");
            }
        });
    });
});


/* Halt execution with an error message. */
function die(message) {
    console.error(message);
    process.exit(1);
}

