
angular.module('userServices', [])

    .factory('User', function ($http) {

        var userFactory = {};

        // User.create()
        userFactory.create = function (userData) {
            return $http.post('/api/users', userData);
        };

        // User.checkUsername(userData)
        userFactory.checkUsername = function (userData) {
            return $http.post('/api/checkusername', userData);
        };

        // User.checkEmail(userData)
        userFactory.checkEmail = function (userData) {
            return $http.post('/api/checkemail', userData);
        };

        userFactory.getPermission = function () {
            return $http.get('/api/permission');
        };

        userFactory.getUsers = function () {
            return $http.get('/api/management');
        };

        // Delete a user
        userFactory.deleteUser = function (username) {
            return $http.delete('/api/management/' + username);
        };

        // Get user with id
        userFactory.getUser = function (id) {
            return $http.get('/api/edit/' + id);
        };

        // Edit a user
        userFactory.editUser = function (userData) {
            return $http.put('/api/edit', userData);
        };

        return userFactory;
    });
