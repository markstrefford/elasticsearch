'use strict';

angular.module('search', ['elasticsearch'])
  .controller('SearchCtrl', ['$scope', 'esService', function ($scope, esService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate for Search and ElasticSearch',
      'AngularJS',
      'Karma'
    ];
  }]);
