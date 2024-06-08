const Joi = require("joi");

const UpdateVideoResultSchema = Joi.object({
  status: Joi.string().required(),
  videoUrl: Joi.string(),
  file: Joi.object(),
});

module.exports = UpdateVideoResultSchema;
