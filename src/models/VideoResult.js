module.exports = (sequelize, DataTypes) => {
    const VideoResult = sequelize.define('VideoResult', {
        // Model attributes
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true
        },
        videoName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        inspectionDate: {
          type: DataTypes.DATE,
          allowNull: false
        },
        inspectorName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        filePathCsv: {
          type: DataTypes.STRING,
          allowNull: true
        },
        filePathPictures: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true
        },
        detectionStatus: {
          type: DataTypes.STRING,
          allowNull: false
        },
    })

    return VideoResult;
}