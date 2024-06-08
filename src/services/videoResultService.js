const videoResultModel = require('../models').VideoResult;
const jwt = require('jsonwebtoken');

class VideoResultService {
  constructor(videoResultModel) {
    this.videoResultModel = videoResultModel;
  }

  initiateVideoResult(videoName, inspectionDate, inspectorName, uuid, bearerToken) {
    const token = bearerToken.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const videoResult = videoResultModel.create({
        id: uuid,
        videoName,
        inspectionDate,
        inspectorName,
        detectionStatus: 'pending',
        userId: decoded.id
    });
    return videoResult;
  }
}

module.exports = new VideoResultService(videoResultModel);