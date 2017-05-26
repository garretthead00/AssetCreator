var models = require('../models/');
var jwt = require('jsonwebtoken');
var secret = 'I solomly swear Im up to no good';

module.exports = function (router) {

    // Creates a new user
    router.post('/users', function (req, res) {
        console.log("/users Creating user began...");
        console.log(req.body.username + ", " + req.body.password + ", " + req.body.email)
        var user = {
            username : req.body.username,
            password : req.body.password,
            email: req.body.email,
            createdAt: req.body.createdAt,
            updatedAt: req.body.updatedAt
        };
        if (user.username == '' || user.username == null || user.password == '' || user.password == null || user.email == '' || user.email == null) {
            res.json({ success: false, message: 'ERROR! Ensure username and password are provided.' });
        } else {
            console.log("/users inputs entered...");
            models.User.create({
                name: req.body.username,
                password: req.body.password,
                email: req.body.email,
                createdAt: req.body.createdAt,
                updatedAt: req.body.updatedAt
            })
            .then(function (result) {
                res.json({ success: true, message: 'User account succesfully created!', user: result });
            }).catch((err) => {
                if (err) {
                    if (err.errors != null) {
                        if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message });
                        } else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message });
                        } else if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message });
                        } else {
                            res.json({ success: false, message: err });
                        }
                    } else if (err) {
                        // Duplicate error code
                        if (err.code == 11000) {
                            res.json({ success: false, message: "Username already taken." });
                        } else {
                            res.json({ success: false, message: err });
                        }
                    }
                }
            });
        }
    });

    // USER LOGIN ROUTE
    router.post('/authenticate', function (req, res) {
        
        models.User.findOne({
            attributes: ['id', 'name', 'email', 'password'],
            where: { name: req.body.username }
        }).then(function(result){
            if(!result){
             res.json({ success: false, message: 'Could not authenticate user.' });
            } else {
				if (req.body.password) {
					console.log("req.body.password: " + req.body.password);
					var validPassword = result.comparePassword(req.body.password);
					console.log("validPassword: " + validPassword);
                    if (!validPassword) {
                        res.json({ success: false, message: 'Could not authenticate password.' });
                    } else {
						var token = jwt.sign({ id: result.id, user: result.name }, secret, { expiresIn: '24h' });
                        res.json({ success: true, message: 'User authenticated!', token: token });
                    }
                } else {
                    res.json({ success: false, message: 'No password provided.' });
                }
            }
        
        }).catch((err)=>{
            throw err;
            console.log("Error loging user in!");
        });
    });

    // Checks if the username provided already exists within the server.
    router.post('/checkusername', function (req, res) {

        models.User.findOne({
            where: { name: req.body.username }
        }).then((result) => {
            if (result) {
                res.json({ success: true, message: "Username already exists" });
            } else {
                res.json({ success: false, message: "Valid username!" });
            }

        })
        .catch((err) => {
            throw err;
            console.log("Error checking username");
            console.log(err);
        });

    });

    // Checks if the email provided already exists within the server.
    router.post('/checkemail', function (req, res) {
        models.User.findOne({
            where: { email: req.body.email }
        }).then((result) => {
            if (result) {
                res.json({ success: true, message: "email already exists" });
            } else {
                res.json({ success: false, message: "Valid email!" });
            }

        })
        .catch((err) => {
            throw err;
            console.log("Error checking email");
            console.log(err);
        });
    });


    // Custom middleware to decrypt the token and send it to the user.
    router.use(function (req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Token invalid' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.json({ success: false, message: "No token provided." });
        }
    });

	router.post('/me', function (req, res) {
		console.log("req.decoded");
		console.log(req.decoded);
        res.send(req.decoded);
    });

    return router;
};


