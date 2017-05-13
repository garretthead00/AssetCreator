var app = angular.module('assetCreatorRoutes', ['ngRoute'])

.config(function ($routeProvider, $locationProvider) {


    //$routeProvider
    //    .when('/', {
    //        templateUrl: 'public/views/pages/home.html',
    //        authenticated: false
    //    })
    //    .when('/home', {
    //        templateUrl: 'public/views/pages/home.html',
    //        authenticated: false

    //    })
    //    .otherwise({ redirectTo: '/' });
    });

app.run(['$rootScope', '$location', function ($rootScope, $location) {
}]);