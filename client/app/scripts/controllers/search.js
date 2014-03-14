'use strict';

angular.module('search', ['leaflet-directive', 'elasticsearch'])
  .controller('SearchCtrl', ['$scope', 'esService', function ($scope) {
        console.log("Setting default lat/long and zoom...");
        angular.extend($scope, {
            center: {
                lat: 53.35,
                lng: -2.3683596,
                zoom: 9
            },
            markers: {}
        })
  }]);




//app.controller("CenterController", [ '$scope', function($scope) {
//    angular.extend($scope, {
//        center: {
//            lat: 40.095,
//            lng: -3.823,
//            zoom: 4
//        },
//        defaults: {
//            scrollWheelZoom: false
//        }
//    });
//}]);