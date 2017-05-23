module.exports = function (sequelize, DataTypes) {
    var Template = sequelize.define('Template', {
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
                Template.belongsToMany(models.Attribute, { through: "TemplateAttributes" });
                Template.belongsToMany(models.Procedure, { through: "TemplateProcedures" });
                Template.belongsTo(models.Analysis, { foreignKey: "analysisId" });
            }
        }
    });
    return Template;

};