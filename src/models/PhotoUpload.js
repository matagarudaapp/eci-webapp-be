module.exports = (sequelize, DataTypes) => {
    const PhotoUpload = sequelize.define('VideoResult', {
        // Model attributes
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        fotoName: {
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
        jenisAssets: {
            type: DataTypes.STRING,
            allowNull: false
        },
        kategoriKerusakan: {
            type: DataTypes.STRING,
            allowNull: false
        },
        jenisKerusakan: {
            type: DataTypes.STRING,
            allowNull: false
        },
        picturesCoordinate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pictureUrl: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })

    return PhotoUpload;
}