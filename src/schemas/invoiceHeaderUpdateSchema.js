import Joi from '@hapi/joi';
import JoiPhoneNumber from 'joi-phone-number';
import invoiceLineUpdateSchema from './invoiceLineUpdateSchema.js';

/*
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

const invoiceHeaderUpdateSchema = Joi.object().keys({
    type: Joi.string().valid('p', 'a', 'f').required(),
    series: Joi.string().max(3).required(),
    number: Joi.string().max(7).required(),
    client_number: Joi.string().max(10),
    date: Joi.date(),
    delivery_date: Joi.date(),
    agent_id: Joi.number().positive(),
    client_id: Joi.number().positive(),
    cif: Joi.string().max(10),
    fiscal_name: Joi.string().max(50),
    address: Joi.string().max(100),
    postal_code: Joi.string().max(5),
    city: Joi.string().max(50),
    country: Joi.string().max(50),
    phone: telJoi.string().phoneNumber(),
    mail: Joi.string().email(),
    shipping_name: Joi.string().max(50),
    shipping_address: Joi.string().max(100),
    shipping_postal_code: Joi.string().max(5),
    shipping_city: Joi.string().max(50),
    shipping_country: Joi.string().max(50),
    shipping_phone: telJoi.string().phoneNumber(),
    packages: Joi.number().positive().default(1),
    observations: Joi.string(),
    lines: Joi.array().items(invoiceLineUpdateSchema).min(1),
});

export default invoiceHeaderUpdateSchema;
