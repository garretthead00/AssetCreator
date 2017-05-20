module.exports = function (sequelize, DataTypes) {
    var Attribute = sequelize.define('Attribute', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    },
    {
        classMethods: {
            associate: function (models) {
                Attribute.belongsToMany(models.Template, { through: "TemplateAttributes" });
            }
        },
    });
    return Attribute;

};