const Joi = require('joi');

const userDtoSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('USER', 'INSTANSI').required()
});

module.exports = userDtoSchema;