
angular.module('userServices', [])

    .factory('User', function ($http) {

        var userFactory = {};

        // User.create()
        userFactory.create = function (userData) {
            return $http.post('/users/users', userData);
        };

        // User.checkUsername(userData)
        userFactory.checkUsername = function (userData) {
            return $http.post('/users/checkusername', userData);
        };

        // User.checkEmail(userData)
        userFactory.checkEmail = function (userData) {
            return $http.post('/users/checkemail', userData);
        };

        //userFactory.getPermission = function () {
        //    return $http.get('/api/permission');
        //};

        //userFactory.getUsers = function () {
        //    return $http.get('/api/management');
        //};

        //// Delete a user
        //userFactory.deleteUser = function (username) {
        //    return $http.delete('/users/management/' + username);
        //};

        //// Get user with id
        //userFactory.getUser = function (id) {
        //    return $http.get('/users/edit/' + id);
        //};

        //// Edit a user
        //userFactory.editUser = function (userData) {
        //    return $http.put('/users/edit', userData);
        //};

        return userFactory;
    });
