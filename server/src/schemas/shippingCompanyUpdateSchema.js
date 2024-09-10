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

const shippingCompanyUpdateSchema = Joi.object().keys({
    name: Joi.string().max(50).messages(joiErrorMessages),
    phone: telJoi.string().phoneNumber().messages(joiErrorMessages),
    email: Joi.string().email().max(100).messages(joiErrorMessages),
});

export default shippingCompanyUpdateSchema;
