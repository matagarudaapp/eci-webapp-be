const Joi = require('joi');

const ForgotPasswordSendEmailDtoSchema = Joi.object({
    email: Joi.string().email().required(),
})

module.exports = ForgotPasswordSendEmailDtoSchema;