module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        // Model attributes
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        }
    })
  
    return Role;
};