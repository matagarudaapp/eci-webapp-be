module.exports = (sequelize, DataTypes) => {
    const VideoResult = sequelize.define('VideoResult', {
        // Model attributes
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true
        },
        filePath: {
          type: DataTypes.STRING,
          allowNull: true
        },
    })

    return VideoResult;
}