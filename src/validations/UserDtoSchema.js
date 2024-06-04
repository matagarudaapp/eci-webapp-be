const Joi = require('joi');

const userDtoSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = userDtoSchema;