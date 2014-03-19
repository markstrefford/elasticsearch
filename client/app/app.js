'use strict';

angular.module('esSearchApp', [
        'ngRoute',
        'searchModule'
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

