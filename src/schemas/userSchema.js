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

const userSchema = Joi.object().keys({
    username: Joi.string().required().max(30).messages(joiErrorMessages),
    password: Joi.string().required().max(100).messages(joiErrorMessages),
    email: Joi.string().email().max(100).messages(joiErrorMessages),
});

export default userSchema;
