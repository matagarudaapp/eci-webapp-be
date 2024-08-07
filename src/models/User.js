module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        // Model attributes
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
      
        },
        forgotPasswordUrlUuid: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        forgotPasswordRequestedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        }
      });
    return User;
}