import Joi from '@hapi/joi';
import joiErrorMessages from './joiErrorMessages.js';
/*
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

const userSchema = Joi.object().keys({
    username: Joi.string().max(50).optional().messages(joiErrorMessages),
    password: Joi.string().max(100).required().messages(joiErrorMessages),
    email: Joi.string().email().max(100).required().messages(joiErrorMessages),
    code: Joi.string().max(10).messages(joiErrorMessages),
    role: Joi.string()
        .valid('administrador', 'empleado', 'cliente', 'comercial')
        .default('cliente')
        .messages(joiErrorMessages),
});

export default userSchema;
