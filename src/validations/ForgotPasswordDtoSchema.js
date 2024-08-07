const Joi = require('joi');

const ForgotPasswordDtoSchema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword:  Joi.string().min(6).required()
})

module.exports = ForgotPasswordDtoSchema;