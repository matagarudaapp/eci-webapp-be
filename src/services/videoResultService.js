const videoResultModel = require("../models").VideoResult;
const { Op } = require("sequelize");

class VideoResultService {
  constructor(videoResultModel) {
    this.videoResultModel = videoResultModel;
  }

  initiateVideoResult(
    videoName,
    inspectionDate,
    inspectorName,
    uuid,
    bearerToken
  ) {
    const token = bearerToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const videoResult = videoResultModel.create({
      id: uuid,
      videoName,
      inspectionDate,
      inspectorName,
      detectionStatus: "pending",
      userId: decoded.id,
    });
    return res
      .status(201)
      .json(
        new ResponseDto(
          true,
          videoResult,
          "Video result initiated successfully"
        )
      );
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

    await this.videoResultModel.update(
      {
        detectionStatus: status,
        videoUrl: videoUrl,
        filePathCsv: file.originalname,
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
