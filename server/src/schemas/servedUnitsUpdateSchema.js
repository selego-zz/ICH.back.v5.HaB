import Joi from '@hapi/joi';

/*
 *     CREATE TABLE IF NOT EXISTS invoice_lines(
 *         line TINYINT UNSIGNED NOT NULL,
 *         completed BOOLEAN DEFAULT FALSE,
 *         reference VARCHAR(15) NOT NULL,
 *         name VARCHAR(30) NOT NULL,
 *         description VARCHAR(30) NOT NULL,
 *         format VARCHAR(20) NOT NULL,
 *         ordered_units DECIMAL(7, 2) NOT NULL,
 *         served_units DECIMAL(7, 2),
 *         adr_text TEXT NOT NULL,
 *
 *         id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 *         header_id INT UNSIGNED NOT NULL,
 *         FOREIGN KEY (header_id) REFERENCES invoice_headers(id),
 *         CONSTRAINT UC_header_id_line UNIQUE (header_id, line),
 *         createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
 *         modifiedAt DATETIME DEFAULT CURRENT_TIMESTAMP
 *     )
 */

const servedUnitsUpdateSchema = Joi.object().keys({
    type: Joi.string().valid('p', 'a', 'f').required(),
    series: Joi.string().max(3).required(),
    number: Joi.string().max(7).required(),
    line: Joi.number().positive().required(),
    served_units: Joi.number().required(),
});

export default servedUnitsUpdateSchema;
