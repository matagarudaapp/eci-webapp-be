const videoResultModel = require('../models').VideoResult;

class VideoResultService {
  constructor(videoResultModel) {
    this.videoResultModel = videoResultModel;
  }
}

module.exports.VideoResultService = new VideoResultService(videoResultModel);