'use strict';

//angular.module('elasticsearch', ['ngResource'])
//    .factory('esService', ['$resource', function($resource) {
//         host: localhost:9200
//    }])


//'use strict';
//angular.module('schools', ['ngResource'])
//    .factory('schoolsService', ['$resource', function($resource) {
//        console.log("schoolsService Factory $resource GET");
//        return $resource('http://schoolus.local\\:3001/schools/:schoolId', {}, {
//            query: {method:'GET', params:{schoolId:'all'},isArray:true}
//        })
//    }]);


//## If you are using Angular
//Use `elasticsearch.angular.js` instead. This will create an `elasticsearch` module with an `esFactory` that you can use.
//```
/*
 * create your app module, specify "elasticsearch" as a dependency
 */
angular.module('esService', ['elasticsearch'])
    .service('es', function (esFactory) {
        return esFactory({
            //host: 'localhost:9200'
            // ...
        });
    });