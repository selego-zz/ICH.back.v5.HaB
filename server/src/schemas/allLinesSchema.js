//importamos las dependencias
import Joi from '@hapi/joi';
import { invoiceLineSchema } from './index.js';

const allLinesSchema = Joi.array().items(invoiceLineSchema).min(1).required();

export default allLinesSchema;
