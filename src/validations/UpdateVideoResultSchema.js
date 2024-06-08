const Joi = require("joi");

const UpdateVideoResultSchema = Joi.object({
  status: Joi.string().required(),
  videoUrl: Joi.string(),
});

module.exports = UpdateVideoResultSchema;
