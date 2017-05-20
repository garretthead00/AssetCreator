angular.module('templateServices', [])

.factory('Template', function($http){

    var templateFactory = {};

    templateFactory.getTemplates = function () {
        return $http.get('/templates/getTemplates');
    };

    templateFactory.getTemplateWith = function (id) {
        return $http.get('/templates/getTemplateWith/' + id);
    };

    templateFactory.createTemplate = function (data) {
        return $http.post('/templates/newTemplate', data);
    };

    templateFactory.removeTemplateWith = function (id) {
        return $http.delete('/templates/removeTemplateWith/' + id);
    };

    templateFactory.updateTemplateWith = function (data) {
        return $http.put('/template/updateTemplateWith');
    };

    return templateFactory;
});