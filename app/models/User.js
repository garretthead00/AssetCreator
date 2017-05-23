module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
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
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password:  {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        classMethods: {
            associate: function (models) {
                User.belongsToMany(models.Notification, { through: "NotificationRecepients" });
                User.belongsToMany(models.Role, { through: "UserRoles" });
            }
        }
    });
    return User;

};