const Joi = require('joi');
const { inspect } = require('mongoose/lib/model');

const initiateVideoResultSchema = Joi.object({
    videoName: Joi.string().required(),
    inspectionDate: Joi.date().required(),
    inspectorName: Joi.string().required(),
    uuid: Joi.string().required()
});

module.exports = initiateVideoResultSchema;