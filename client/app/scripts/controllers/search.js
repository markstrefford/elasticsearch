'use strict';

angular.module('searchModule', ['leaflet-directive', 'esService'])
    .controller('SearchCtrl', ['$scope', 'es', function ($scope, es) {

        console.log("Setting default lat/long and zoom...");
        // TODO - Make this auto-centre later...
        var search={};

        angular.extend($scope, {center: {
                    lat: 53.45,
                    lng: -2.48,
                    zoom: 10
                }});
        $scope.markers= {};
        $scope.hotels = {};

        // Now do the default search
        // TODO - Make this dynamic!!
        search.request = {   "fields": [ "id", "name", "geo", "description", "starrating", "custrating"],
            "from": 0, "size": 5,
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

        var newSearch = function (searchReq) {
            console.log("Starting search()...");
            console.log("search(): " + JSON.stringify(searchReq));
            var m = {},
                h = {};
            // Use promises here based on http:...
            es.search({
                host: 'localhost:9200/hotels/hotel',
                body: searchReq
            }).then(function (body) {
                    // Iterate through results and update $scope
                    var searchRes = body.hits.hits;
                    console.log("SearchRes: " + JSON.stringify(searchRes));
                    for (var i in searchRes) {
                        console.log("searchRes["+i+"]:" +  JSON.stringify(searchRes));
                        var hotel = searchRes[i];
                        //console.log("Processing " + JSON.stringify(hotel));
                        m[hotel._id] = {
                            "lat": hotel.fields.geo.split(",")[0],
                            "lng": hotel.fields.geo.split(",")[1],
                            "message": hotel.fields.name,
                            "draggable": false
                        };
                        h[hotel._id] = {
                            "name": hotel.fields.name,
                            "description": hotel.fields.description,
                            "starrating": hotel.fields.starrating,
                            "custrating": hotel.fields.custrating

                        }
                    }
                    //console.log(JSON.stringify($scope.markers));
                    //console.log(JSON.stringify(m));
                    console.log("New markers[]:" + JSON.stringify(m));
                    $scope.markers = m;
                    $scope.hotels = h;
                }, function (error) {
                    console.trace(error.message);
                });
        }

        // Now render the map with the default search
        newSearch(search.request);


        // Called from search.html "Search" button
        $scope.refineSearch = function (request) {
            scope.results = newSearch(request);
        }

    }])
;


