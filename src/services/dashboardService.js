const videoResultModel = require("../models").VideoResult;
const cloudStorageService = require("./cloudStorageService");
const { parse } = require("csv-parse/sync");

const getDashboardUserDataFromCsv = async (userId, roles) => {
    var videoResults = null;

    if(roles.includes("ADMIN")) {
        videoResults = videoResultModel.findAll({
            where: {
                detectionStatus: "VERIFIED"
            }
    });
    }else{
        videoResults = await videoResultModel.findAll({
            where: {
                userId,
                detectionStatus: "VERIFIED"
            },
        });
    }
    
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

    let roadOverallDamageScore = 0;

    for (const videoResult of videoResults) {

        const csvContentString = await cloudStorageService.getCsvContent(videoResult.id);
        
        if (!csvContentString) {
            continue;
        }

        const csvData = parse(csvContentString, {
            columns: true
        });

        // console.log(csvData);

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
      
            // count road overall damage score
            roadOverallDamageScore += Number(row["Node Crack Score"]);
      
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
    }

    return {
        roadCondition,
        totalVolumeCrack,
        maintenanceCostEstimation,
        numberOfCrack,
        roadOverallDamageScore,
    };
}

module.exports = { getDashboardUserDataFromCsv };
