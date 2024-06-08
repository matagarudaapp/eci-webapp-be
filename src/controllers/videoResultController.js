const ResponseDto = require("../models/dto/response/ResponseDto");
const VideoResultService = require("../services/videoResultService");
const initiateVideoResultSchema = require("../validations/InitiateVideoResultSchema");
const UpdateVideoResultSchmea = require("../validations/UpdateVideoResultSchema");

module.exports.videoResultFilePathFromModel_post = (req, res) => {};

module.exports.initateVideoResultRecord_post = async (req, res) => {
  try {
    const result = initiateVideoResultSchema.validate(req.body);
    if (result.error) {
      return res.status(400).json({ error: result.error.details[0].message });
    }

    const dataResponse = await VideoResultService.initiateVideoResult(
      req.body.videoName,
      req.body.inspectionDate,
      req.body.inspectorName,
      req.headers.authorization
    );
    return res
      .status(201)
      .json(
        new ResponseDto(
          true,
          dataResponse,
          "Video result initiated successfully"
        )
      );
  } catch (error) {
    return res
      .status(400)
      .json(new ResponseDto(false, null, "Failed to initiate video result"));
  }
};
module.exports.videoResults_get = async (req, res) => {
  const needVerificationOnly = req.query.needVerification;

  const videoResults = await VideoResultService.getAllVideoResult(
    needVerificationOnly === "true" ? true : false
  );

  res
    .status(200)
    .json(
      new ResponseDto(
        true,
        { videoResults },
        "Successfully get all video results"
      )
    );
};
module.exports.videoResult_get = async (req, res) => {
  const id = req.params.id;

  const videoResult = await VideoResultService.getVideoResult(id);

  if (videoResult === null) {
    res
      .status(404)
      .json(
        new ResponseDto(
          false,
          null,
          "Video result with the given id not exists"
        )
      );
  } else {
    res
      .status(200)
      .json(
        new ResponseDto(true, { videoResult }, "Successfully get video result")
      );
  }
};
module.exports.videoResult_get_file = (req, res) => {};

module.exports.videoResult_patch = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const file = req.file;

  const { error } = UpdateVideoResultSchmea.validate(data);
  if (error) {
    return res
      .status(400)
      .json(new ResponseDto(false, null, error.details[0].message));
  }

  const { status, videoUrl } = data;

  if (status !== "ON_VERIFICATION" && status !== "VERIFIED") {
    return res
      .status(400)
      .json(new ResponseDto(false, null, "Invalid status value"));
  }

  if (status === "ON_VERIFICATION" && (videoUrl || file)) {
    return res
      .status(400)
      .json(
        new ResponseDto(
          false,
          null,
          '"ON_VERIFICATION" status must without video and csv file'
        )
      );
  }

  if (status === "VERIFIED" && (!videoUrl || !file)) {
    return res
      .status(400)
      .json(
        new ResponseDto(
          false,
          null,
          '"VERIFIED" status must with video and csv file'
        )
      );
  }

  if (status === "VERIFIED" && file && !file.originalname.endsWith(".csv")) {
    return res
      .status(400)
      .json(new ResponseDto(false, null, "Uploaded file must be a csv file"));
  }

  try {
    await VideoResultService.updateVideoResult(id, data, file);

    res
      .status(200)
      .json(new ResponseDto(true, null, "Successfully update trials"));
  } catch (e) {
    if (e.message == "Not Found") {
      return res
        .status(404)
        .json(
          new ResponseDto(false, e, "Video result with the given id not exists")
        );
    }

    res
      .status(500)
      .json(new ResponseDto(false, e, "Failed to update video result"));
  }
};

module.exports.videoResultAnalysis = async (req, res) => {
  const id = req.params.id;

  const videoResult = await VideoResultService.getVideoResult(id);

  if (videoResult === null) {
    res
      .status(404)
      .json(
        new ResponseDto(
          false,
          null,
          "Video result with the given id not exists"
        )
      );
  }

  const responseData = await VideoResultService.getVideoResultAnalysis(
    videoResult
  );

  res
    .status(200)
    .json(new ResponseDto(true, responseData, "Successfully get video result"));
};
