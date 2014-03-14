'use strict';

angular.module('esSearchApp', [
        'ngRoute',
        'search'
    ]).config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/search.html',
                controller: 'SearchCtrl'
            })

            .otherwise({
                redirectTo: '/'
            });
    });

