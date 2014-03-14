'use strict';

angular.module('search', ['leaflet-directive', 'esService'])
    .controller('SearchCtrl', ['$scope', 'es', function ($scope, es) {
        console.log("Setting default lat/long and zoom...");
        angular.extend($scope, {
            center: {
                lat: 53.35,
                lng: -2.3683596,
                zoom: 9
            },
            markers: {}
        })
        es.ping({
            requestTimeout: 1000,
            hello: "elasticsearch!"
        }, function (error) {
            if (error) {
                console.error('elasticsearch cluster is down!');
            } else {
                console.log('All is well');
            }
        });

        // Now do a search
        var searchReq = { "fields": [ "id", "name", "geo"],
            "query": {
                "filtered": {
                    "query": {
                        "match_all": {}
                    },
                    "filter": {
                        "geo_distance": {
                            "distance": "2km",
                            "geo": [-2.9897, 53.39879]
                        }
                    }
                }
            }};
        var m = {};
        es.search({
            host: 'localhost:9200/hotels/hotel',
            body: searchReq
        }).then(function (body) {
                console.log("Hits: " + JSON.stringify(body.hits.hits));
                for (var i in body.hits.hits) {
                    var hotel = body.hits.hits[i];
                    var hotelId = hotel._id;
                    var hotelName = hotel.fields.name;
                    var hotelLoc = hotel.fields.geo;
                    console.log("Id:" + hotelId + ",Name:" + hotelName + ",Geo:" + hotelLoc);
                    //$scope.markers[hotel._id.geo]={type: "point", "location": [hotelLoc]};
                    //$scope.markers[hotel._id.message]= hotelName;
                    m[hotelId] = {
                        "location": {"type": "point", "location": hotelLoc},
                        "message": hotelName
                    };
                }
                //console.log(JSON.stringify($scope.markers));
                console.log(JSON.stringify(m));
                $scope.markers=m;
            }, function (error) {
                console.trace(error.message);
            });
    }])
;


//var markers = {
//    school: {
//        lat: $scope.school.loc.coordinates[1],
//        lng: $scope.school.loc.coordinates[0],
//        draggable: false,
//        message: $scope.school.name,
//        focus: true
//    }
