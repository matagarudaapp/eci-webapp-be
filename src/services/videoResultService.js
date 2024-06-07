const videoResultModel = require("../models").VideoResult;

class VideoResultService {
  constructor(videoResultModel) {
    this.videoResultModel = videoResultModel;
  }

  async getAllVideoResult() {
    return await this.videoResultModel.findAll();
  }

  async getVideoResult(id) {
    return await this.videoResultModel.findOne({
      where: {
        id,
      },
    });
  }

  async updateVideoResult(id, data) {}
}

module.exports = new VideoResultService(videoResultModel);
