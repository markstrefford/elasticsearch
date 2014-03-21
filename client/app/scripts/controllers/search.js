'use strict';

angular.module('searchModule', ['leaflet-directive', 'esService'])
    .controller('SearchCtrl', ['$scope', 'es', function ($scope, es) {

        var search={};
        angular.extend($scope, {center: {
                    lat: 53.45,
                    lng: -2.48,
                    zoom: 10
                }});
        angular.extend($scope, {markers: {}});
        angular.extend($scope, {hotels: {}});
        $scope.stats = {esFrom: 0, esSize: 25};

        search.request = { "fields": [ "id", "name", "geo", "description", "starrating", "custrating"],
            "from" : $scope.stats.esFrom, "size" : $scope.stats.esSize,
            "query": {
                "term": {
                    "description": "spa"
                }
            }}


        // Called from search.html "Search" button
        $scope.refineSearch = function (request) {
            newSearch(request);

            //$scope.$apply();
        }

        var newSearch = function (searchReq) {
            console.log("search(): " + JSON.stringify(searchReq));
            var m = {},
                h = {};
            // Use promises here based on http:...
            es.search({
                host: 'localhost:9200/hotels/hotel',
                body: searchReq
            }).then(function (body) {
                    // Iterate through results and update $scope
                    $scope.stats.numResults = body.hits.total;
                    var searchRes = body.hits.hits;
                    for (var i in searchRes) {
                        var hotel = searchRes[i];
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
                    $scope.hotels=h;
                    $scope.markers=m;
                    //$scope.apply;
                }, function (error) {
                    console.trace(error.message);
                });
            //return {markers: m, hotels: h};
        }

        // Now render the map with the default search
        newSearch(search.request);

    }])
;


