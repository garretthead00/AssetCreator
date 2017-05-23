angular.module('templateController', ['templateServices'])

.controller('templateCtrl', function ($scope, Template) {

    console.log("Hello from templateController");

    var app = this;
    $scope.isUploading = false;
    $scope.newProcedure = {};
    $scope.newAttribute = null;
    $scope.templates = [];
    $scope.setCurrentTemplate = function () {
        $scope.currentTemplate = {
            name: null,
            description: null,
            derivedTemplate: null,
            analysis: {
                name: null,
                expression: null,
                outputAttribute: null,
                scheduling: {
                    eventTrigger: {
                        expression: null
                    },
                    periodic: {
                        startAt: {
                            expression: null,
                            hour: null,
                            minute: null,
                            amPm: null
                        },
                        repeatOn: {
                            expression: null,
                            hour: null,
                            minute: null
                        }
                    },
                }
            },
            attributes: [], 
            procedures: []
        };
    };

    // fetches all templates for the user
    $scope.getTemplates = function () {
        Template.getTemplates().then(function (data) {
            if (data.data.success) {
               // console.log("Templates returned successfully");
                if (data.data.templates) {
                    //console.log("Templates exist in db");
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
    $scope.setCurrentTemplate();
    

    function convertStartAt(t) {
        if (t) {
            var time = t.split(/[\s:]+/);
            return time;
        }
        return false;
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
                console.log("Show Template: ");
                console.log(data.data.template);

                var startAt = (data.data.template.Analysis.periodicStartAt) ? convertStartAt(data.data.template.Analysis.periodicStartAt) : null;
                var repeatOn = (data.data.template.Analysis.periodicRepeatOn) ? convertStartAt(data.data.template.Analysis.periodicRepeatOn) : null;
                $scope.currentTemplate = {
                    name: data.data.template.name,
                    description: data.data.template.description,
                    derivedTemplate: data.data.template.derivedTemplate,
                    attributes: data.data.template.Attributes,
                    procedures: data.data.template.Procedures,
                    analysis: {
                        name: data.data.template.Analysis.name,
                        expression: data.data.template.Analysis.expression,
                        outputAttribute: data.data.template.Analysis.outputAttribute,
                        scheduling: {
                            eventTrigger: {
                                expression: data.data.template.Analysis.eventTrigger
                            },
                            periodic: {
                                startAt: {
                                    expression: data.data.template.Analysis.periodicStartAt,
                                    hour: startAt[0],
                                    minute: startAt[1],
                                    amPm: startAt[2]
                                },
                                repeatOn: {
                                    expression: data.data.template.Analysis.periodicRepeatOn,
                                    hour: repeatOn[0],
                                    minute: repeatOn[1]
                                }
                            },
                        }
                    }
                };
            } else {
                $scope.setCurrentTemplate();
            }
        });
    };


    $scope.createNewTemplate = function (data) {
        $scope.isUploading = true;
        $scope.currentTemplate = data;
        $scope.currentTemplate.analysis.scheduling.periodic.startAt.expression = data.analysis.scheduling.periodic.startAt.hour + ":" + data.analysis.scheduling.periodic.startAt.minute + " " + data.analysis.scheduling.periodic.startAt.amPm;
        $scope.currentTemplate.analysis.scheduling.periodic.repeatOn.expression = data.analysis.scheduling.periodic.repeatOn.hour + ":" + data.analysis.scheduling.periodic.repeatOn.minute;
        Template.createTemplate($scope.currentTemplate).then(function (data) {
            if (data.data.success) {
                console.log("New template created successfully!");
                console.log(data.data.message);
                $scope.setCurrentTemplate();
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
        $scope.currentTemplate.attributes.push({
            name: $scope.newAttribute
        });
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

    $scope.resetTemplateForm = function () {
        $scope.setCurrentTemplate();
    };


    // fired when the derivedTemplate droplist selection is changed.
    $scope.setDerivedTemplate = function () {
        console.log("setDerivedTemplate fired!");
        var index = $scope.templates.indexOf($scope.currentTemplate.derivedTemplate);
        if (index >= 0) {
            // get the values for the derivedTemplate to be inherited by the currentTemplate
            Template.getTemplateWith($scope.currentTemplate.derivedTemplate.id).then(function (data) {
                if (data.data.success) {

                    var startAt = (data.data.template.Analysis.periodicStartAt) ? convertStartAt(data.data.template.Analysis.periodicStartAt) : null;
                    var repeatOn = (data.data.template.Analysis.periodicRepeatOn) ? convertStartAt(data.data.template.Analysis.periodicRepeatOn) : null;
                    $scope.currentTemplate.attributes = $scope.currentTemplate.attributes.concat(data.data.template.Attributes);
                    $scope.currentTemplate.procedures = $scope.currentTemplate.procedures.concat(data.data.template.Procedures);
                    $scope.currentTemplate.analysis.scheduling.periodic.startAt = {
                        expression: data.data.template.Analysis.periodicStartAt,
                        hour: startAt[0],
                        minute: startAt[1],
                        amPm: startAt[2]
                    };
                    $scope.currentTemplate.analysis.scheduling.periodic.repeatOn = {
                        expression: data.data.template.Analysis.periodicRepeatOn,
                        hour: repeatOn[0],
                        minute: repeatOn[1]
                    };

                } else {
                    $scope.setCurrentTemplate();
                }
            });
        }

    }
});