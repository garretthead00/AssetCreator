angular.module('mainController', ['authenticationServices', 'userServices'])

    .controller('mainCtrl', function (Auth, User, $timeout, $location, $rootScope, $window, $interval) {

        var app = this;
        app.isAdmin = false;
        app.isMod = false;

        // Check if user's session has expired upon opening page for the first time
        if (Auth.isLoggedIn()) {
            // Check if a the token expired
            Auth.getUser().then(function (data) {
                // Check if the returned user is undefined (expired)
                if (data.data.user === undefined) {
                    Auth.logout(); // Log the user out
                    app.isLoggedIn = false; // Set session to false
                    $location.path('/'); // Redirect to login page
                    app.loadme = true; // Allow loading of page
                }
            });
           
        } else {
            // Redirect to login page
            app.errorMsg = false;
			app.successMsg = false;
			$location.path('/login'); // Redirect to login page
            
        }

        // Function to run an interval that checks if the user's token has expired
        app.checkSession = function () {
            if (Auth.isLoggedIn()) {
                app.checkingSession = true;
                var interval = $interval(function () {
                    var token = $window.localStorage.getItem('token');
                    if (token === null) {
                        $interval.cancel(interval);
                    } else {
                        self.parseJwt = function (token) {
                            var base64Url = token.split('.')[1];
                            var base64 = base64Url.replace('-', '+').replace('_', '/');
                            return JSON.parse($window.atob(base64));
                        };
                        var expireTime = self.parseJwt(token);
                        var timeStamp = Math.floor(Date.now() / 1000);
                        var sessionTimeRemaining = expireTime.exp - timeStamp;
                        //console.log('session time remaining: ' + sessionTimeRemaining);
                        if (sessionTimeRemaining <= 0) {
                            //console.log('token has expired.');
                            $interval.cancel(interval); // Stop interval
                            Auth.logout(); // Log the user out
                            app.isLoggedIn = false; // Set session to false
                            $location.path('/'); // Redirect to home page
                        }
                         else {
                         	//console.log('token not yet expired.');
                         }
                    }
                }, 2000);
            }
        };

        app.checkSession();

        // Anytime a new route is requested, check whether the user is logged in.
        $rootScope.$on('$routeChangeStart', function () {
            // Check the session time for expiration.
            if (!app.checkingSession) app.checkSession();

            // When the page loads, check if the user is logged in.
            if (Auth.isLoggedIn()) {
                app.isLoggedIn = true;
				Auth.getUser().then(function (data) {
                    app.id = data.data.id;
					app.username = data.data.user;
					console.log("user: " + data.data.user);
					User.getPermission(data.data.user).then(function (data) {
						console.log(data);
						if (data.data.role === 'Admin') {
							console.log("Admin");
							app.isAdmin = true;
						} else if (data.data.role === 'Mod') {
							console.log("Mod");
							app.isMod = true;
						} 
                    });
                });
            } else {
                app.isLoggedIn = false;
                app.username = "";
            }
        });

        // Function to login the user.
        this.loginUser = function (loginData) {
            app.errorMsg = false;
            Auth.login(app.loginData).then(function (data) {
                if (data.data.success) {
                    app.successMsg = data.data.message + "...Redirecting.";
                    $timeout(function () {
                        $location.path('/home');
                        app.loginData = '';
                        app.successMsg = false;
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message;
                }
            });
        };

        // Function to logout the user.
        this.logoutUser = function () {
            Auth.logout();
            $window.location.reload();
        };

    });