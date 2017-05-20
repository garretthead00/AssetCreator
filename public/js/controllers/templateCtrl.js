angular.module('templateController', ['templateServices'])

.controller('templateCtrl', function ($scope, Template) {

    console.log("Hello from templateController");

    var app = this;
    $scope.isUploading = false;
    $scope.newProcedure = {};
    $scope.newAttribute = null;
    $scope.templates = [];
    $scope.currentTemplate = {
        name: null,
        description: null,
        derivedTemplate: null,
        analysis: {
            name : null,
            expression: null,
            outputAttribute:null

        },
        attributes: [],
        scheduling: {
            eventTrigger: {
                expression: null
            },
            periodic: {
                startAt: {
                    hour: null,
                    minute: null,
                    amPm: null
                },
                repeatOn: {
                    hour: null,
                    minute : null
                }
            },
        },
        procedures: []
    };

    // fetches all templates for the user
    $scope.getTemplates = function () {
        Template.getTemplates().then(function (data) {
            if (data.data.success) {
                console.log("Templates returned successfully");
                if (data.data.templates) {
                    console.log("Templates exist in db");
                    $scope.templates = data.data.templates;
                } else {
                    console.log("No templates exist in db");
                }
            } else {
                console.log("No templates returned from db.");
            }
        });
    };

    // fetch all templates
    $scope.getTemplates();

    function convertStartAt(t) {
        var time = t.split(/[\s:]+/);
        var timeObj = {
            hour: time[0],
            minute: time[1],
            amPm: time[2]
        }
        return timeObj;
    };

    function convertRepeatOn(t) {
        var time = t.split(/[\s:]+/);
        var timeObj = {
            hour: time[0],
            minute: time[1]
        }
        return timeObj;
    };

    // fetches the template by id
    $scope.showTemplate = function (data) {
        Template.getTemplateWith(data.id).then(function (data) {
            if (data.data.success) {
                console.log(data.data.template);
                var startAt = convertStartAt(data.data.template.schedulingPeriodicStartAt);
                var repeatOn = convertRepeatOn(data.data.template.schedulingPeriodicRepeatOn);

                $scope.currentTemplate = {
                    name: data.data.template.name,
                    description: data.data.template.description,
                    derivedTemplate: data.data.template.derivedTemplate,
                    analysis: {
                        name: data.data.template.analysisName,
                        expression: data.data.template.analysisExpression,
                        outputAttribute: data.data.template.analysisOutputAttribute

                    },
                    attributes: [],
                    scheduling: {
                        eventTrigger: {
                            expression: data.data.template.schedulingEventTriggerExpression
                        },
                        periodic: {
                            expression: data.data.template.schedulingPeriodicExpression,
                            startAt: {
                                hour: startAt.hour,
                                minute: startAt.minute,
                                amPm: startAt.amPm
                            },
                            repeatOn: {
                                hour: repeatOn.hour,
                                minute: repeatOn.minute
                            }
                        },
                    },
                    procedures: []
                };
            } else {
                $scope.currentTemplate = {};
            }
        });
    };

    // ng-click "Create" button
    $scope.createNewTemplate = function (data) {
        $scope.isUploading = true;
        $scope.currentTemplate = data;
        console.log($scope.currentTemplate);
        Template.createTemplate($scope.currentTemplate).then(function (data) {
            if (data.data.success) {
                console.log("New template created successfully!");
                console.log(data.data.message);

                $scope.currentTemplate = {};
                $scope.getTemplates();
            } else {
                console.log("New template created unsuccessfully!");
                console.log(data.data.message);
            }
        });
        $scope.isUploading = false;
    };

    // ng-click "RemoveTemplate" button
    $scope.removeTemplate = function (id) {
        console.log("removeTemplateWith fired! id: " + id);
        Template.removeTemplateWith(id).then(function (data) {
            if (data.data.success) {
                console.log("Template removed");
                $scope.getTemplates();
            } else {
                console.log('Template not removed');
            }
        });
    };

    // ng-click "Update" button
    $scope.updateTemplateWith = function (id) {
        console.log("updateTemplateWith fired!");
        $scope.isUploading = true;
        $scope.isUploading = false;
    };

    // ng-click "+" button on attributes table
    $scope.addAttributeToTemplate = function () {
        console.log("addAttributeToTemplateWith fired!");
        $scope.currentTemplate.attributes.push($scope.newAttribute);
        $scope.newAttribute = null;
    };

    // ng-click trash button on attributes table
    $scope.removeAttributeFromTemplate = function (data) {
        console.log("removeAttributeFromTemplateWith fired!");
        var index = $scope.currentTemplate.attributes.indexOf(data);
        if (index > -1) {
            $scope.currentTemplate.attributes.splice(index, 1);
        }
        $scope.newAttribute = null;
    };

    // ng-click "+" button on procedures table
    $scope.addProcedureToTemplate = function () {
        console.log("addProcedureToTemplateWith fired!");
        $scope.currentTemplate.procedures.push($scope.newProcedure);
        $scope.newProcedure = {};
    };

    // ng-click trash button on procedures table
    $scope.removeProcedureFromTemplate = function (data) {
        console.log("removeProcedureFromTemplateWith fired!");
        var index = $scope.currentTemplate.procedures.indexOf(data);
        if (index > -1) {
            $scope.currentTemplate.procedures.splice(index, 1);
        }
        $scope.newProcedure = {};
    };

});