const ResponseDto = require("../models/dto/response/ResponseDto");
const VideoResultService = require("../services/videoResultService");

module.exports.videoResultFromModel_post = (req, res) => {};
module.exports.videoResults_get = async (req, res) => {
  const videoResults = await VideoResultService.getAllVideoResult();

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
        new ResponseDto(
          true,
          { videoResult },
          "Successfully get trials details"
        )
      );
  }
};
module.exports.videoResult_get_file = (req, res) => {};

module.exports.videoResult_patch = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  await VideoResultService.updateTrials(id, data);

  res
    .status(200)
    .json(new ResponseDto(true, null, "Successfully update trials"));
};
