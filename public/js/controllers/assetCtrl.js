angular.module('assetController', ['assetServices'])

.controller('assetCtrl', function ($scope, Asset, Template) {

    console.log("Hello from assetController");

    var app = this;
    $scope.isUploading = false;
    $scope.newAttribute = null;
	$scope.assets = [];
	$scope.templates = [];
	$scope.derivedList = [];


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

    $scope.setCurrentAsset = function () {
        $scope.currentAsset = {
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
            notification: {
                name: null,
                expression: null,
                recipients: [],
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
            
        };
    };

    $scope.getAssets = function(){
        Asset.getAssets().then(function(data){
            if (data.data.success){
                if(data.data.assets){
                    $scope.assets = data.data.assets;
                } else {
                    console.log("No assets exist in db.");
                }
            } else {
				console.log("Error fetching assets from db.");
				console.log( "Message" + data.data.message);

            }
		});
	};

	// fetches all templates for the user
	$scope.getTemplates = function () {
		Template.getTemplates().then(function (data) {
			if (data.data.success) {
				console.log("assetCtrl: Templates returned successfully");
				if (data.data.templates) {
					console.log("assetCtrl: Templates exist in db");
					$scope.templates = data.data.templates;
				} else {
					console.log("assetCtrl: No templates exist in db");
				}
			} else {
				console.log("assetCtrl: No templates returned from db.");
			}
		});
	};

	// fetches the asset by id
	$scope.showAsset = function (data) {
		Asset.getAssetWith(data.id).then(function (data) {
			if (data.data.success) {
				console.log("Show Asset: ");
				console.log(data.data.asset);

				var startAt = (data.data.asset.Analysis.periodicStartAt) ? convertStartAt(data.data.asset.Analysis.periodicStartAt) : null;
				var repeatOn = (data.data.asset.Analysis.periodicRepeatOn) ? convertStartAt(data.data.asset.Analysis.periodicRepeatOn) : null;
				$scope.currentAsset = {
					name: data.data.asset.name,
					description: data.data.asset.description,
					derivedTemplate: data.data.asset.derivedTemplate,
					attributes: data.data.asset.Attributes,
					procedures: data.data.asset.Procedures,
					analysis: {
						name: data.data.asset.Analysis.name,
						expression: data.data.asset.Analysis.expression,
						outputAttribute: data.data.asset.Analysis.outputAttribute,
						scheduling: {
							eventTrigger: {
								expression: data.data.asset.Analysis.eventTrigger
							},
							periodic: {
								startAt: {
									expression: data.data.asset.Analysis.periodicStartAt,
									hour: startAt[0],
									minute: startAt[1],
									amPm: startAt[2]
								},
								repeatOn: {
									expression: data.data.asset.Analysis.periodicRepeatOn,
									hour: repeatOn[0],
									minute: repeatOn[1]
								}
							},
						}
					}
				};
			} else {
				$scope.setCurrentAsset();
			}
		});
	};

	$scope.createNewAsset = function (data) {
		$scope.isUploading = true;
		$scope.currentAsset = data;
		$scope.currentAsset.analysis.scheduling.periodic.startAt.expression = data.analysis.scheduling.periodic.startAt.hour + ":" + data.analysis.scheduling.periodic.startAt.minute + " " + data.analysis.scheduling.periodic.startAt.amPm;
		$scope.currentAsset.analysis.scheduling.periodic.repeatOn.expression = data.analysis.scheduling.periodic.repeatOn.hour + ":" + data.analysis.scheduling.periodic.repeatOn.minute;
		Asset.createAsset($scope.currentAsset).then(function (data) {
			if (data.data.success) {
				console.log("New asset created successfully!");
				console.log(data.data.message);
				$scope.setCurrentAsset();
				$scope.getAssets();
			} else {
				console.log("New asset created unsuccessfully!");
				console.log(data.data.message);
			}
		});
		$scope.isUploading = false;
	};

	// ng-click "RemoveAsset" button
	$scope.removeAsset = function (id) {
		console.log("removeAssetWith fired! id: " + id);
		Asset.removeAssetWith(id).then(function (data) {
			if (data.data.success) {
				console.log("Asset removed");
				$scope.getAssets();
			} else {
				console.log('Asset not removed');
			}
		});
	};

	// ng-click "Update" button
	$scope.updateAssetWith = function (id) {
		console.log("updateAssetWith fired!");
		$scope.isUploading = true;
		$scope.isUploading = false;
	};

	// ng-click "+" button on attributes table
	$scope.addAttributeToAsset = function () {
		console.log("addAttributeToAssetWith fired!");
		$scope.currentAsset.attributes.push({
			name: $scope.newAttribute
		});
		$scope.newAttribute = null;
	};

	// ng-click trash button on attributes table
	$scope.removeAttributeFromAsset = function (data) {
		console.log("removeAttributeFromAssetWith fired!");
		var index = $scope.currentAsset.attributes.indexOf(data);
		if (index > -1) {
			$scope.currentAsset.attributes.splice(index, 1);
		}
		$scope.newAttribute = null;
	};

	// notifications

	$scope.resetAssetForm = function () {
		$scope.setCurrentAsset();
	};

	function resetAttributesList(list) {

		for (x in list) {
			console.log("x.id: " + x.id);

		}
		//return originalList;
	};

	// fired when the derivedTemplate droplist selection is changed.
	$scope.setDerivedTemplate = function () {
		console.log("setDerivedAsset fired!");
		var index = $scope.templates.indexOf($scope.currentAsset.derivedTemplate);
		console.log($scope.currentAsset.derivedTemplate);
		console.log("selected index: " + index);

		resetAttributesList($scope.currentAsset.attributes);

		if (index >= 0) {
			// get the values for the derivedTemplate to be inherited by the currentAsset
			Asset.getAssetWith($scope.currentAsset.derivedTemplate.id).then(function (data) {
				if (data.data.success) {
					console.log("found derived asset");
					var startAt = (data.data.asset.Analysis.periodicStartAt) ? convertStartAt(data.data.asset.Analysis.periodicStartAt) : null;
					var repeatOn = (data.data.asset.Analysis.periodicRepeatOn) ? convertStartAt(data.data.asset.Analysis.periodicRepeatOn) : null;
					$scope.currentAsset.attributes = $scope.currentAsset.attributes.concat(data.data.Asset.Attributes);
					$scope.currentAsset.procedures = $scope.currentAsset.procedures.concat(data.data.Asset.Procedures);
					$scope.currentAsset.analysis.name = data.data.asset.Analysis.name,
					$scope.currentAsset.analysis.expression= data.data.asset.Analysis.expression,
					$scope.currentAsset.analysis.outputAttribute= data.data.asset.Analysis.outputAttribute,
					$scope.currentAsset.analysis.scheduling.periodic.startAt = {
						expression: data.data.asset.Analysis.periodicStartAt,
						hour: startAt[0],
						minute: startAt[1],
						amPm: startAt[2]
					};
					$scope.currentAsset.analysis.scheduling.periodic.repeatOn = {
						expression: data.data.asset.Analysis.periodicRepeatOn,
						hour: repeatOn[0],
						minute: repeatOn[1]
					};

				} else {
					console.log("no derived asset found. searching for template");
					// get the values for the derivedTemplate to be inherited by the currentAsset
					Template.getTemplateWith($scope.currentAsset.derivedTemplate.id).then(function (data) {
						if (data.data.success) {

							var startAt = (data.data.template.Analysis.periodicStartAt) ? convertStartAt(data.data.template.Analysis.periodicStartAt) : null;
							var repeatOn = (data.data.template.Analysis.periodicRepeatOn) ? convertStartAt(data.data.template.Analysis.periodicRepeatOn) : null;
							$scope.currentAsset.attributes = $scope.currentAsset.attributes.concat(data.data.template.Attributes);
							$scope.currentAsset.analysis.scheduling.periodic.startAt = {
								expression: data.data.template.Analysis.periodicStartAt,
								hour: startAt[0],
								minute: startAt[1],
								amPm: startAt[2]
							};
							$scope.currentAsset.analysis.scheduling.periodic.repeatOn = {
								expression: data.data.template.Analysis.periodicRepeatOn,
								hour: repeatOn[0],
								minute: repeatOn[1]
							};

						} else {
							$scope.setCurrentAsset();
						}
					});
				}
			});
		}

	}


	// run the command on each reload
	$scope.getAssets();
	$scope.getTemplates();
	$scope.setCurrentAsset();

});