const Joi = require('joi');

const ForgotPasswordDtoSchema = Joi.object({
    newPassword:  Joi.string().min(6).required()
})

module.exports = ForgotPasswordDtoSchema;