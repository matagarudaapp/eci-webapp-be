const Joi = require("joi");

const UpdateVideoResultSchema = Joi.object({
  status: Joi.string().required(),
  filePathCsv: Joi.string(),
  videoUrl: Joi.string(),
});

module.exports = UpdateVideoResultSchema;
