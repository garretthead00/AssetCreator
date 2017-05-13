//'use strict';
var express = require('express');
router = express.Router();

//module.exports = function (router) {
    /* GET users listing. */
    router.get('/', function (req, res) {
        res.send('respond with a resource');
    });

//};

//return router;


module.exports = router;
