const Joi = require('joi');

const initiateVideoResultSchema = Joi.object({
  videoName: Joi.string().required(),
  inspectionDate: Joi.date().required(),
  inspectorName: Joi.string().required(),
  // uuid: Joi.string().required(),
  pictureUrl: Joi.string().required(),
  pictureCoordinates: Joi.string().required(),
});

module.exports = initiateVideoResultSchema;
