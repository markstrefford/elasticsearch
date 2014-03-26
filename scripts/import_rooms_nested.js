#!/usr/bin/env node
if (process.argv.length != 4) {
    die('import room json into elastic search\n' +
        'usage: import_rooms_nested <file_or_directory_to_import> <elasticsearch_url>');
}

/**
 * Import room data into elastic search
 */

// http://stackoverflow.com/questions/15121584/how-to-parse-a-large-newline-delimited-json-file-by-jsonstream-module-in-node-j
var fs = require('fs'),
    JSONStream = require('JSONStream'),
    _ = require('underscore'),
    request = require('request');


var roomDir = process.argv[2],
    esURL = process.argv[3];

/*
 * Import rooms from JSON and insert into hotels
 */

var roomData = {};

var postToElasticSearch = function (json) {
    var esPostUrl = esURL + "/" + json.hotelid + "/_update";
    var nestedJson = {"script": "ctx._source.room += room",
        "params": {
            "room": json
        }
    }
    request.post(esPostUrl, {"body": JSON.stringify(nestedJson)}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        } else {
            if (body.indexOf("version conflict")) {
                console.log("Version conflict... retrying " + json.hotelid);
                postToElasticSearch(json);
            } else {
                die(body);
            }
        }
    });
}

fs.readdir(roomDir, function (err, files) {
    if (err) throw err;
    var c = 0;
    files.forEach(function (file) {
        c++;
        fs.readFile(roomDir + file, 'utf-8', function (err, json) {
            if (err) throw err;
            var roomJson = JSON.parse(json);

            // Some "cleansing"!!
            if (roomJson.breakfast = 0) roomJson.breakfast = "FALSE";
            if (roomJson.breakfast = 1) roomJson.breakfast = "TRUE";
            if (roomJson.dinner = 0) roomJson.dinner = "FALSE";
            if (roomJson.dinner = 1) roomJson.dinner = "TRUE";
            if (roomJson.rack_rate = "NULL") roomJson.rack_rate = "2000";

            roomData[roomJson.id] = roomJson;

            //console.log("Indexing " + JSON.stringify(hotelJson));
            postToElasticSearch(roomJson);
            if (0 === --c) {
                console.log(roomData);  //socket.emit('init', {data: data});
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

