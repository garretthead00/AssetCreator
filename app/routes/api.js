

module.exports = function (router) {

    // USER LOGIN ROUTE
    router.post('/authenticate', function (req, res) {
        User.findOne({ username: req.body.username }).select('username password').exec(function (err, user) {
            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Could not authenticate user.' });
            } else if (user) {
                if (req.body.password) {
                    var validPassword = user.comparePassword(req.body.password);
                    if (!validPassword) {
                        res.json({ success: false, message: 'Could not authenticate password.' });
                    } else {
                        var token = jwt.sign({ _id: user._id, username: user.username }, secret, { expiresIn: '24h' });
                        res.json({ success: true, message: 'User authenticated!', token: token });
                    }
                } else {
                    res.json({ success: false, message: 'No password provided.' });
                }

            }
        });
    });

    router.post('/me', function (req, res) {
        res.send(req.decoded);
    });

    // Custom middleware to decrypt the token and send it to the user.
    //router.use(function (req, res, next) {
    //    var token = req.body.token || req.body.query || req.headers['x-access-token'];

    //    if (token) {
    //        jwt.verify(token, secret, function (err, decoded) {
    //            if (err) {
    //                res.json({ success: false, message: 'Token invalid' });
    //            } else {
    //                req.decoded = decoded;
    //                next();
    //            }
    //        });
    //    } else {
    //        res.json({ success: false, message: "No token provided." });
    //    }
    //});
    return router;
};


