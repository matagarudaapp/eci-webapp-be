const Joi = require('joi');

const RegisterUserDtoSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('USER', 'INSTANSI').required()
});

module.exports = RegisterUserDtoSchema;