var bcrypt = require('bcrypt');

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
				User.belongsTo(models.Role, { foreignKey: "roleId" });
            }
        },
        instanceMethods: {
			comparePassword: function (password) {
				console.log("password: " + password + " hash: " + this.password);
	            return bcrypt.compareSync(password, this.password);
			}



        }
    
    });
	User.beforeCreate((user, options) => {
		return bcrypt.hash(user.password, 10)
		.then((hash) => {
			user.password = hash; // assign the hash to the user's password so it is saved in database encrypted				}).catch((err) => {
			return hash;
		}).catch((err)=>{
			if (err) return next(err);
		})
	});

    return User;

};