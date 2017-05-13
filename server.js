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
var appRoutes = require('./routes/api');
var users = require('./routes/users');
const sql = require('mssql');
var app = express();


// Configure the database.
var dbConfig = {
    
    server: "localhost\\SQLEXPRESS", // IP\InstanceName
    database: "assetCreator",
    user: "Garrett",
    password: "lsutigers1",
    port: 1433
};

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

// declare the client-side paths to the libraries being referenced on index.html
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrapJS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/angular')); // redirect JS AngularJS
app.use('/js', express.static(__dirname + '/node_modules/angular-route')); // redirect JS Angular-Route
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/api', appRoutes);
//app.use('/users', users);

//var conn = new sql.Connection(dbConfig); // Establish the db connection instance.
var connection = new sql.Connection(dbConfig);
var req = new sql.Request(connection); // establish the db Request instance.
// Connect to the db.
sql.connect(function (err) {
    if (err) {
        throw err;
        console.log("Error establishing a connection to the database");
        console.log(err);
        return;
    }
    else {
        console.log("Connection to the database successfully!");
    }
});



//send our index.html file to the user for the home page
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/views/index.html'));
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