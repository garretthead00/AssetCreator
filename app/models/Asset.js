module.exports = function (sequelize, DataTypes) {
    var Asset = sequelize.define('Asset', {
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
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        derivedTemplate: DataTypes.STRING,
       
        stage: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        classMethods: {
            associate: function (models) {
                Asset.belongsToMany(models.Attribute, { through: "AssetAttributes" });
                Asset.belongsTo(models.Analysis, { foreignKey: "analysisId" });
                Asset.belongsTo(models.Notification, { foreignKey: "notificationId" });
            }
        }
    });
    return Asset;

};