const ResponseDto = require('../models/dto/response/ResponseDto');
const authService = require('../services/authService');
const emailService = require('../services/emailService')
const jwt = require("jsonwebtoken");
const ForgotPasswordSendEmailDtoSchema = require('../validations/ForgotPasswordSendEmailDtoSchema');
const ForgotPasswordDtoSchema = require('../validations/ForgotPasswordDtoSchema')


module.exports.forgotPassword_get = async (req, res) => {
    try {
        const forgotPasswordUrlUuid = req.params.forgotPasswordUrlUuid;
        
        const data = await authService.forgotPasswordGet(forgotPasswordUrlUuid)
        return res.status(200).json(new ResponseDto(true, data, 'Success'));
    } catch (error) {     
        return res.status(500).json(new ResponseDto(false, null, error.message));
    }
}

module.exports.forgotPassword_post = async (req, res) => {
    try {
        // Validate the UserDto
        const forgotPasswordUrlUuid = req.params.forgotPasswordUrlUuid;
        const { error } = ForgotPasswordDtoSchema.validate(req.body);
        if (error) {
            return res.status(400).json(new ResponseDto(false, null, error.details[0].message));
        }
        const data = await authService.forgotPasswordPost(forgotPasswordUrlUuid, req.body);
        return res.status(200).json(new ResponseDto(true, data, 'Success'));
    } catch (error) {
        return res.status(500).json(new ResponseDto(false, null, error.message));
    }
}

module.exports.forgotPasswordSendEmail_post = async (req, res) => {
    try {
        // Validate the UserDto
        const { error } = ForgotPasswordSendEmailDtoSchema.validate(req.body);
        if (error) {
            return res.status(400).json(new ResponseDto(false, null, error.details[0].message));
        }
        const data = await emailService.sendForgotPasswordEmail(req.body.email);
        return res.status(200).json(new ResponseDto(true, data, 'Success'));
    } catch (error) {
        return res.status(500).json(new ResponseDto(false, null, error.message));
    }
}