angular.module('assetCreatorApp', ['assetCreatorRoutes', 'mainController', 'templateServices', 'templateController', 'authServices', 'userServices'])


// configure the app to intercept all http request with the AuthInterceptors factory.
.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
    
});