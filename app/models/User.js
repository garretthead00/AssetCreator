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
                User.belongsToMany(models.Role, { through: "UserRoles" });
            }
        },
        instanceMethods: {
            comparePassword: function(password){
	            return bcrypt.compareSync(password, this.password);
            }
        },
        hooks: {
            beforeCreate: () => {
                var user = this;
                // Function to encrypt password 
                bcrypt.hash(user.password, null, null, function (err, hash) {
                    if (err) return next(err); // Exit if error is found
                    user.password = hash; // Assign the hash to the user's password so it is saved in database encrypted
                    next(); // Exit Bcrypt function
                });

                bcrypt.genSalt(saltRounds, function (err, salt) {
                    bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
                        // Store hash in your password DB. 
                    });
                });
            }

        }
    
    });


    return User;

};