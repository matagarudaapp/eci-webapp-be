const videoResultModel = require("../models").VideoResult;
const { Op } = require("sequelize");
const { uploadCsv, getCsvContent } = require("./cloudStorageService");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { parse } = require("csv-parse/sync");
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

    const csvUrl = status === "VERIFIED" ? await uploadCsv(file, id) : "";
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

  async getVideoResultAnalysis(videoResult) {

    const csvString = await getCsvContent(videoResult.id);

    const csvData = parse(csvString, { columns: true });

    const roadCondition = {
      undamaged: 0,
      mildDamage: 0,
      moderateDamage: 0,
      severeDamage: 0,
    };
    const totalVolumeCrack = {
      pothole: 0,
      alligator: 0,
      longAndLatCrack: 0,
    };
    let maintenanceCostEstimation = 0;
    const numberOfCrack = {
      pothole: 0,
      alligator: 0,
      lateralCrack: 0,
      longitudinalCrack: 0,
    };

    csvData.forEach((row) => {
      // count number of crack
      numberOfCrack.longitudinalCrack += Number(row["Long Crack Found"]);
      numberOfCrack.lateralCrack += Number(row["Lat Crack Found"]);
      numberOfCrack.alligator += Number(row["Alligator Crack Found"]);
      numberOfCrack.pothole += Number(row["Pothole Found"]);

      // count total volume crack
      totalVolumeCrack.longAndLatCrack += Number(row["Total Crack Length (m)"]);
      totalVolumeCrack.alligator += Number(row["Alligator Crack Area (m2)"]);
      totalVolumeCrack.pothole += Number(row["Pothole Area (m2)"]);

      // count cost estimation
      maintenanceCostEstimation += Number(row["Repair Cost (Long) (Rp)"]);
      maintenanceCostEstimation += Number(row["Repair Cost (Lat) (Rp)"]);
      maintenanceCostEstimation += Number(row["Repair Cost (Alligator) (Rp)"]);
      maintenanceCostEstimation += Number(row["Repair Cost (Pothole) (Rp)"]);

      // count road condition
      const nodeRoadCondition = row["Node Road Condition"];
      if (nodeRoadCondition === "Tidak Rusak") {
        roadCondition.undamaged++;
      } else if (nodeRoadCondition === "Rusak Ringan") {
        roadCondition.mildDamage++;
      } else if (nodeRoadCondition === "Rusak Sedang") {
        roadCondition.moderateDamage++;
      } else if (nodeRoadCondition === "Rusak Berat") {
        roadCondition.severeDamage++;
      }
    });

    return {
      downloadUrl: videoResult.csvUrl,
      roadCondition,
      totalVolumeCrack,
      maintenanceCostEstimation,
      numberOfCrack,
    };
  }
}

module.exports = new VideoResultService(videoResultModel);
