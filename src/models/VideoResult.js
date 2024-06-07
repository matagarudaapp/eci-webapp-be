module.exports = (sequelize, DataTypes) => {
    const VideoResult = sequelize.define('VideoResult', {
        // Model attributes
        id: {
          type: DataTypes.UUID,
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
        videoUrl: {
          type: DataTypes.STRING,
          allowNull: true
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