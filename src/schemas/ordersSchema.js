//importamos las dependencias
import Joi from '@hapi/joi';
import { invoiceHeaderSchema } from './index.js';

const ordersSchema = Joi.array().items(invoiceHeaderSchema).min(1).required();

export default ordersSchema;
