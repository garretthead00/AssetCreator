var app = angular.module('assetCreatorRoutes', ['ngRoute'])

.config(function ($routeProvider, $locationProvider) {


    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            authenticated: false
        })
        .when('/home', {
            templateUrl: 'views/home.html',
            authenticated: false

        })
        .when('/login', {
            templateUrl: 'views/login.html',
            authenticated: false
        })
        .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode({
            enabled: true,
            requiredBase: false
        });
});
app.run(['$rootScope', 'Auth', '$location', 'User', function ($rootScope, Auth, $location, User) {


    // Fire each time a route changes
    $rootScope.$on('$routeChangeStart', function (event, next, current) {

        // Check if is a valid route
        if (next.$$route !== undefined) {

            // If the route requires authentication,
            // prevent the user from accessing this route if the user is not logged in.
            if (next.$$route.authenticated === true) {
                if (!Auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/');
                }
                // check if the route requires permission.
                else if (next.$$route.permission) {
                    User.getPermission().then(function (data) {
                        if (next.$$route.permission[0] !== data.data.permission) {
                            if (next.$$route.permission[1] !== data.data.permission) {
                                event.preventDefault();
                                $location.path('/');
                            }
                        }
                    });

                }

            }
        }
    });
}]);
