const videoResultModel = require("../models").VideoResult;
const { Op } = require("sequelize");
const { uploadCsv } = require("./cloudStorageService");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

class VideoResultService {
  constructor(videoResultModel) {
    this.videoResultModel = videoResultModel;
  }

  async initiateVideoResult(
    videoName,
    inspectionDate,
    inspectorName,
    bearerToken
  ) {
    const token = bearerToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const idVideoResult = uuidv4();
    const videoResult = await videoResultModel.create({
      id: idVideoResult,
      videoName,
      inspectionDate,
      inspectorName,
      detectionStatus: "SUBMITTED",
      userId: decoded.id,
    });
    return videoResult;
  }

  async getAllVideoResult(needVerificationOnly = false) {
    if (!needVerificationOnly) return await this.videoResultModel.findAll();

    return await this.videoResultModel.findAll({
      where: {
        [Op.or]: [
          { detectionStatus: "SUBMITTED" },
          { detectionStatus: "ON_VERIFICATION" },
        ],
      },
    });
  }

  async getVideoResult(id) {
    return await this.videoResultModel.findOne({
      where: {
        id,
      },
    });
  }

  async updateVideoResult(id, { status, videoUrl }, file) {
    const videoResult = this.getVideoResult(id);

    if (videoResult === null) {
      throw new Error("Not Found");
    }

    const csvUrl = status === "SUBMITTED" ? await uploadCsv(file) : "";
    await this.videoResultModel.update(
      {
        detectionStatus: status,
        videoUrl,
        csvUrl,
      },
      {
        where: {
          id,
        },
      }
    );
  }
}

module.exports = new VideoResultService(videoResultModel);
