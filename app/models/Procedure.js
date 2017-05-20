module.exports = function (sequelize, DataTypes) {
    var Procedure = sequelize.define('Procedure', {
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
                Procedure.belongsToMany(models.Template, { through: "TemplateProcedures" });
            }
        },
    });
    return Procedure;

};