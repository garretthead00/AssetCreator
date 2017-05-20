var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(module.filename);
var db = {};

// Configure the database.
var dbConfig = {
    server: "localhost", // IP\InstanceName
    database: "AssetCreator",
    dialect: 'mssql',
    user: "Garrett",
    password: "lsutigers1",
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    logging: false
};

// Setup sequelize connection string to the DB.
var sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.server,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    logging: dbConfig.logging    // disable logging; default: console.log
});

//Load all the models
fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function (file) {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

//Export the db Object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;