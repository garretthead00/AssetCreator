angular.module('assetCreatorApp', ['assetCreatorRoutes', 'mainController', 'templateServices', 'templateController', 'authenticationServices', 'userServices', 'assetServices', 'assetController', 'signupController'])


// configure the app to intercept all http request with the AuthInterceptors factory.
.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
    
});