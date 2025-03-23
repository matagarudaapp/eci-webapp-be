const ResponseDto = require("../models/dto/response/ResponseDto");
const videoValidationService = require("../services/videoValidationService");
const driveService = require("../services/driveService");
const { v4: uuidv4 } = require("uuid");
const videoResultService = require("../services/videoResultService");
const fs = require('fs');

module.exports.validateVideo_post = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json(new ResponseDto(false, null, "No video file uploaded"));
    }

    console.log(`Validating video: ${req.file.originalname} (${req.file.size} bytes)`);

    // Validate the video
    const validationResults = await videoValidationService.validateVideo(req.file);

    if (!validationResults.isValid) {
      // Clean up the file if validation fails
      fs.unlink(req.file.path, (err) => {
        if (err) console.error(`Error deleting invalid video file: ${err.message}`);
      });

      return res.status(400).json(
        new ResponseDto(
          false,
          { errors: validationResults.errors },
          "Video validation failed"
        )
      );
    }

    return res.status(200).json(
      new ResponseDto(
        true, 
        { metadata: validationResults.metadata },
        "Video validated successfully"
      )
    );
  } catch (error) {
    console.error("Error validating video:", error);
    
    // Clean up the file on error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error(`Error deleting video file after error: ${err.message}`);
      });
    }
    
    return res
      .status(500)
      .json(new ResponseDto(false, null, "Error validating video: " + error.message));
  }
};

module.exports.uploadVideo_post = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json(new ResponseDto(false, null, "No video file uploaded"));
    }

    console.log(`Processing video upload: ${req.file.originalname} (${req.file.size} bytes)`);

    // 1. Validate the video
    const validationResults = await videoValidationService.validateVideo(req.file);
    
    if (!validationResults.isValid) {
      // Clean up the file if validation fails
      fs.unlink(req.file.path, (err) => {
        if (err) console.error(`Error deleting invalid video file: ${err.message}`);
      });

      return res.status(400).json(
        new ResponseDto(
          false,
          { errors: validationResults.errors },
          "Video validation failed"
        )
      );
    }

    // 2. Upload to Google Drive
    console.log("Uploading video to Google Drive...");
    const uploadResult = await driveService.uploadFile(req.file, process.env.GOOGLE_DRIVE_FOLDER_ID);

    // 3. Create a record in the database
    const videoUuid = uuidv4();
    const dataResponse = await videoResultService.initiateVideoResult(
      req.file.originalname,
      new Date(),
      req.body.inspectorName || 'Unknown',
      videoUuid,
      req.headers.authorization
    );

    // 4. Update the record with the Google Drive URL
    await videoResultService.updateVideoResult(videoUuid, {
      status: "SUBMITTED",
      videoUrl: uploadResult.webViewLink || uploadResult.webContentLink
    }, null);

    return res.status(201).json(
      new ResponseDto(
        true,
        {
          id: videoUuid,
          videoName: req.file.originalname,
          driveInfo: uploadResult
        },
        "Video uploaded and processed successfully"
      )
    );
  } catch (error) {
    console.error("Error uploading video:", error);
    
    // Clean up the file on error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error(`Error deleting video file after error: ${err.message}`);
      });
    }
    
    return res
      .status(500)
      .json(new ResponseDto(false, null, "Error uploading video: " + error.message));
  }
};