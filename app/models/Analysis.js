

module.exports = function (sequelize, DataTypes) {
    var Analysis = sequelize.define('Analysis', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        expression: {
            type: DataTypes.STRING,
            allowNull: false
        },
        outputAttribute: {
            type: DataTypes.STRING,
            allowNull: false
        },
        eventTrigger: {
            type: DataTypes.STRING,
            allowNull: true
        },
        periodicStartAt: {
            type: DataTypes.STRING,
            allowNull: true
        },
        periodicRepeatOn: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                Analysis.hasMany(models.Template, {as : "Analysis", foreignKey: "analysisId"});
                Analysis.hasMany(models.Asset, {as: "Analysis", foreignKey: "analysisId"});
            }
        }
    });
    return Analysis;

};