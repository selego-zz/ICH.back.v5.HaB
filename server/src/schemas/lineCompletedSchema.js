import Joi from '@hapi/joi';

const lineCompletedSchema = Joi.object().keys({
    completed: Joi.boolean(),
    series: Joi.string().max(3).required(),
    number: Joi.string().max(7).required(),
    line: Joi.number().required(),
});

export default lineCompletedSchema;
