import Joi from '@hapi/joi';
import joiErrorMessages from './joiErrorMessages.js';
/**
 *     CREATE TABLE IF NOT EXISTS users(
 *         username VARCHAR(30) NOT NULL,
 *         password VARCHAR(100) NOT NULL,
 *         role ENUM ('administrador', 'empleado', 'cliente', 'comercial') DEFAULT 'cliente',
 *
 *         id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
 *         createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
 *         modifiedAt DATETIME DEFAULT CURRENT_TIMESTAMP
 *     )`;
 */

const userUpdateSchema = Joi.object().keys({
    username: Joi.string().max(30).optional().messages(joiErrorMessages),
    password: Joi.string().max(100).optional().messages(joiErrorMessages),
    email: Joi.string().email().max(100).optional().messages(joiErrorMessages),
    role: Joi.string()
        .optional()
        .valid('administrador', 'empleado', 'cliente', 'comercial')
        .default('cliente')
        .messages(joiErrorMessages),
});

export default userUpdateSchema;
