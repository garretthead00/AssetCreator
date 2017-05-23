'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var templateRoutes = require('./app/routes/templateRoutes')(router);
var assetRoutes = require('./app/routes/assetRoutes')(router);
var userRoutes = require('./app/routes/userRoutes')(router);
const sql = require('mssql');
const Sequelize = require('sequelize');
var models = require('./app/models/');
var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set the port
app.set('port', port);

// Require static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set 'views' directory for any views being rendered res.render()
app.set('views', path.join(__dirname, '/public/views'));

// Set view engine as EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Declare the client-side paths to the libraries being referenced on index.html
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrapJS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/angular')); // redirect JS AngularJS
app.use('/js', express.static(__dirname + '/node_modules/angular-route')); // redirect JS Angular-Route
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap/fonts')); // redirect CSS bootstrap
app.use('/api', appRoutes);
app.use('/templates', templateRoutes);
app.use('/assets', assetRoutes);

// Fixes the Angular ngRoute refeshing problem
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// Test the db connection.
models.sequelize.authenticate()
    .then(function () {
        console.log('Connection to db successful!');
    })
    .catch(function (error) {
        console.log("Error creating connection to db:", error);
    });

models.sequelize.sync().then(function () {
    console.log("DB tables synced to the Server!");
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handlers

app.use(function (err, req, res, next) {
    res.status(err.status || 404);
    res.status(404);
    res.render('404');
    // render the error.html page with error message.
    //res.render('error', {
    //    message: err.message,
    //    error: {}
    //});
});

// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.status(500);
    res.render('500');
    //res.render('error', {
    //    message: err.message,
    //    error: {}
    //});
});


app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + ' press Ctrl + C to terminate.');
});