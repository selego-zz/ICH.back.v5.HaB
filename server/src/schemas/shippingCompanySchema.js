import Joi from '@hapi/joi';
import joiErrorMessages from './joiErrorMessages.js';
import JoiPhoneNumber from 'joi-phone-number';

/*
 *   CREATE TABLE IF NOT EXISTS shipping_company(
 *       name VARCHAR(50) NOT NULL,
 *       phone VARCHAR(15) NOT NULL,
 *       mail VARCHAR(50) NOT NULL,
 *       defaultSelection BOOLEAN DEFAULT FALSE,
 *
 *       id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 *       createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
 *       modifiedAt DATETIME DEFAULT CURRENT_TIMESTAMP
 *     )`;
 */

const telJoi = Joi.extend(JoiPhoneNumber);

const shippingCompanySchema = Joi.object().keys({
    name: Joi.string().max(50).required().messages(joiErrorMessages),
    phone: telJoi.string().phoneNumber().required().messages(joiErrorMessages),
    email: Joi.string().email().max(100).required().messages(joiErrorMessages),
    defaultSelection: Joi.boolean().default(false).messages(joiErrorMessages),
});

export default shippingCompanySchema;
