import Joi from '@hapi/joi';
import JoiPhoneNumber from 'joi-phone-number';
import { invoiceLineSchema } from './index.js';

/**
 *     CREATE TABLE IF NOT EXISTS invoice_headers(
 *         type ENUM ('p', 'a', 'f') DEFAULT 'p',
 *         series CHAR(3) NOT NULL,
 *         number CHAR(7) NOT NULL,
 *         client_number  VARCHAR(7),
 *         date DATE DEFAULT (CURRENT_DATE),
 *         delivery_date DATE DEFAULT (CURRENT_DATE),
 *         agent_id INT UNSIGNED   NOT NULL,
 *         client_id INT UNSIGNED  NOT NULL,
 *         cif VARCHAR(10) NOT NULL,
 *         fiscal_name VARCHAR(50) NOT NULL,
 *         address VARCHAR(100) NOT NULL,
 *         postal_code CHAR(5) NOT NULL,
 *         city VARCHAR(50) NOT NULL,
 *         country VARCHAR(50) NOT NULL,
 *         phone VARCHAR(15) NOT NULL,
 *         mail VARCHAR(50) NOT NULL,
 *         shipping_name VARCHAR(10) NOT NULL,
 *         shipping_address VARCHAR(100) NOT NULL,
 *         shipping_postal_code CHAR(5) NOT NULL,
 *         shipping_city VARCHAR(50) NOT NULL,
 *         shipping_country VARCHAR(50) NOT NULL,
 *         shipping_phone VARCHAR(15) NOT NULL,
 *         packages TINYINT UNSIGNED DEFAULT 1,
 *         observations TEXT,
 *
 *         id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 *         CONSTRAINT UC_type_series_number UNIQUE (type, series, number),
 *         FOREIGN KEY(agent_id) REFERENCES users(id),
 *         FOREIGN KEY(client_id) REFERENCES users(id),
 *         createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
 *         modifiedAt DATETIME DEFAULT CURRENT_TIMESTAMP
 *     )
 */

const telJoi = Joi.extend(JoiPhoneNumber);
const invoiceHeaderSchema = Joi.object().keys({
    type: Joi.string().valid('p', 'a', 'f').default('p'),
    series: Joi.string().max(3).required(),
    number: Joi.string().max(7).required(),
    client_number: Joi.string().max(10),
    date: Joi.date(),
    delivery_date: Joi.date(),
    agent_id: Joi.number().positive().required(),
    client_id: Joi.number().positive().required(),
    cif: Joi.string().max(10).required(),
    fiscal_name: Joi.string().max(50).required(),
    address: Joi.string().max(100).required(),
    postal_code: Joi.string().max(5).required(),
    city: Joi.string().max(50).required(),
    country: Joi.string().max(50).required(),
    phone: telJoi.string().phoneNumber().required(),
    mail: Joi.string().email().required(),
    shipping_name: Joi.string().max(50),
    shipping_address: Joi.string().max(100),
    shipping_postal_code: Joi.string().max(5),
    shipping_city: Joi.string().max(50),
    shipping_country: Joi.string().max(50),
    shipping_phone: telJoi.string().phoneNumber(),
    packages: Joi.number().positive().required().default(1),
    observations: Joi.string(),
    lines: Joi.array().items(invoiceLineSchema).min(1).required(),
});

export default invoiceHeaderSchema;
