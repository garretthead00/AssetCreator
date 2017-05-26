module.exports = function (sequelize, DataTypes) {
    var Role = sequelize.define('Role', {
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
        }
    },
    {
        classMethods: {
            associate: function (models) {
				Role.hasMany(models.User, { as: "Role", foreignKey: "roleId" });
            }
        }
    });
    return Role;

};