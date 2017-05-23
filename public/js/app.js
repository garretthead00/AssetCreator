angular.module('assetCreatorApp', ['assetCreatorRoutes', 'mainController', 'templateServices', 'templateController', 'authServices', 'userServices', 'assetServices', 'assetController'])


// configure the app to intercept all http request with the AuthInterceptors factory.
.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
    
});