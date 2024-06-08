const ResponseDto = require('../models/dto/response/ResponseDto');
const initiateVideoResultSchema = require('../validations/InitiateVideoResultSchema');
const videoResultService = require('../services/videoResultService')

module.exports.videoResultFilePathFromModel_post = (req, res) => {
    
};

module.exports.initateVideoResultRecord_post = (req, res) => {
    try {
        const result = initiateVideoResultSchema.validate(req.body);
        if (result.error) {
            return res.status(400).json(new ResponseDto(false, null, result.error.message));
        }
        const dataResponse = videoResultService.initiateVideoResult(req.body.videoName, req.body.inspectionDate, req.body.inspectorName, req.body.uuid, req.headers.authorization);
        return res.status(201).json(new ResponseDto(true, dataResponse, 'Video result initiated successfully'));
    } catch (error) {
        console.log(error.message)
        return res.status(400).json(new ResponseDto(false, null, 'Failed to initiate video result'));
    }
};
module.exports.videoResults_get = (req, res) => {};
module.exports.videoResult_get = (req, res) => {};
module.exports.videoResult_get_file = (req, res) => {};