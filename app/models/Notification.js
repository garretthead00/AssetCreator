
module.exports = function (sequelize, DataTypes) {
    var Notification = sequelize.define('Notification', {
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
           
        classMethods: {
            associate: function (models) {
                Notification.hasMany(models.Asset, { foreignKey: "notificationId" });
                Notification.belongsToMany(models.User, { through: "NotificationRecepients" });

            }
        }
    });
    return Notification;

};