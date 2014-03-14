'use strict';

angular.module('search', ['leaflet-directive', 'esService'])
    .controller('SearchCtrl', ['$scope', 'es', function ($scope, es) {

        var m = {},
            h = {};

        console.log("Setting default lat/long and zoom...");
        // TODO - Make this auto-centre later...
        angular.extend($scope, {
            center: {
                lat: 53.45,
                lng: -2.48,
                zoom: 10
            },
            markers: {}
        })

        // Setting scope for hotels later
        angular.extend($scope, { hotels: {}});

        // Now do a search
        // TODO - Make this dynamic!!

        var searchReq = {   "fields": [ "id", "name", "geo", "description", "starrating", "custrating"],
            "from" : 0, "size" : 1000,
            "query": {
                "matchAll": {}
            },
            "sort": [
                {
                    "_geo_distance": {
                        "geo": "-2.9897, 53.39879",
                        "unit": "km"
                    }
                }
            ]
        };

        /*
         var searchReq= { "fields": [ "id", "name", "geo", "description"],
         "query": {
         "match_all": {}
         }
         }
         */

        // Use promises here based on http://brianoneill.blogspot.co.uk/2014/01/elasticsearch-from-angularjs-fun-w.html
        es.search({
            host: 'localhost:9200/hotels/hotel',
            body: searchReq
        }).then(function (body) {
                console.log("Hits: " + JSON.stringify(body.hits.hits));
                // Iterate through results and update $scope
                for (var i in body.hits.hits) {
                    var hotel = body.hits.hits[i];
                    console.log("Processing " + JSON.stringify(hotel));
                    m[hotel._id] = {
                        "lat": hotel.fields.geo.split(",")[0],
                        "lng": hotel.fields.geo.split(",")[1],
                        "message": hotel.fields.name,
                        "draggable": false
                    };
                    h[hotel._id] = {
                        "name": hotel.fields.name,
                        "description": hotel.fields.description,
                        "starrating" : hotel.fields.starrating,
                        "custrating" : hotel.fields.custrating
                    }
                }
                //console.log(JSON.stringify($scope.markers));
                console.log(JSON.stringify(m));
                $scope.markers = m;
                $scope.hotels = h;
            }, function (error) {
                console.trace(error.message);
            });
    }])
;


