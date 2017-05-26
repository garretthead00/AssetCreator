module.exports = function (sequelize, DataTypes) {
    var PiTag = sequelize.define('PiTag', {
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
            allowNull: true
        }
    });
    return PiTag;

};