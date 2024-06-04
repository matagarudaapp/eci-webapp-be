const ResponseDto = require("../models/dto/response/ResponseDto")

module.exports.test = (req, res) => {
    return res.status(200).json(new ResponseDto(true, 'test', 'Success'))
}