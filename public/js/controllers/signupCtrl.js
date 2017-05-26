angular.module('signupController', ['userServices','authenticationServices'])


.controller('signupCtrl', function($http, $location, $timeout, User, Auth){

    var app = this;


    // This function get's the current date and returns the value in the form of the 
    // SQL DateTime2  Ex: 2017-05-23 19:26:51.0000000
    function todaysDateToSQLString() {

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var hour = today.getHours();
        var minute = today.getMinutes();
        var second = today.getSeconds();
        var ms = today.getMilliseconds();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        today = yyyy + "-" + mm + "-" + dd + " " + hour + ":" + minute + ":" + second + "." + ms;
        return (today);
    };


	this.signupUser = function(userData, valid){

		app.errorMsg = false;

        if (valid) {
            
			// send POST to create the new user.
			// Then if the user account was created successfully auto-Login the user.
            app.userData.createdAt = todaysDateToSQLString();
            app.userData.updatedAt = todaysDateToSQLString();
            User.create(app.userData).then(function (data) {
                console.log("Creating user began...");
                console.log(app.userData);
                if (data.data.success) {
                    console.log("Creating user succesful...");
					Auth.login(data.data.user).then(function(data){
						if(data.data.success){
							app.successMsg = data.data.message + "...Redirecting.";
							$timeout(function(){
								$location.path('/');
								
								app.successMsg = false;
							}, 2000);
						} else{
							app.errorMsg = data.data.message;
						}
					});
				} else{
					app.errorMsg = data.data.message;
				}
			});
		} else {
			app.errorMsg = "Form submitted with errors.";
		}
	};

	this.checkUsername = function(userData){
		app.usernameMsg = false;
		app.isUsernameInvalid = false;

        User.checkUsername(app.userData).then(function(data){
			if(data.data.success){
				app.isUsernameInvalid = true;
				app.usernameMsg = data.data.message;
			} else {
				app.isUsernameInvalid = false;
				app.usernameMsg = data.data.message;
			}
		});
	};
	
	this.checkEmail = function(userData){
		app.emailMsg = false;
		app.isEmailInvalid = false;

        User.checkEmail(app.userData).then(function(data){
			if(data.data.success){
				app.isEmailInvalid = true;
				app.emailMsg = data.data.message;
			} else {
				app.isEmailInvalid = false;
				app.emailMsg = data.data.message;
			}
		});
	};
})

.directive('match', function(){
	return {
		restrict : 'A',
		controller: function($scope){

			$scope.confirmed = false;

			$scope.doConfirm = function(values){
				values.forEach(function(el){
					if($scope.confirm == el){
						$scope.confirmed = true;
					} else {
						$scope.confirmed = false;
					}
				});
			}
		},
		link: function(scope, element, attrs){
			attrs.$observe('match', function(){
				scope.matches = JSON.parse(attrs.match);
				scope.doConfirm(scope.matches);
			});
			scope.$watch('confirm', function(){
				scope.matches = JSON.parse(attrs.match);
				scope.doConfirm(scope.matches);
			});
		}
	}
});
