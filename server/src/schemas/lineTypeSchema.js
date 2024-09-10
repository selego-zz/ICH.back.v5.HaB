import Joi from '@hapi/joi';

const lineTypeSchema = Joi.object().keys({
    type: Joi.string().valid('p', 'a', 'f'),
    series: Joi.string().max(3).required(),
    number: Joi.string().max(7).required(),
    newType: Joi.string().valid('p', 'a', 'f'),
    line: Joi.number(),
});

export default lineTypeSchema;
