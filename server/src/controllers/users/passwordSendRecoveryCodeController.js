import crypto from 'crypto';
/**
 * Función controladora que envía un correo al usuario para cambiar su contraseña
 * @middleware authWorkerController - Middleware para comprobar permisos de borrado.
 * @param {Object} req - Objeto request
 * @param {Object} req.body - Datos del usuario
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'ok', 'error'
 * @param {string} res.message - Mensaje explicativo de respuesta o de error
 * @param {Function} next - La función de middleware siguiente.
 * @description Crea un codigo de recuperación, lo guarda en la tabla usuario, y envía un correo electrónico al usuario para restaurar su contraseña.
 */

import {
    generateErrorUtil,
    generateRecoverPassMailUtil,
    sendHtmlMail,
} from '../../utils/index.js';
import { getUserByEmailModel, updateUserModel } from '../../models/index.js';

const passwordSendRecoveryCodeController = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) generateErrorUtil('Faltan campos', 400);

        // Comprobamos que el usuario existe
        const user = await getUserByEmailModel(email);
        if (!user) generateErrorUtil('Usuario no encontrado', 404);

        if (!user.recoverPassCode) {
            // Generamos un código de recuperación de contraseña.
            const recoverPassCode = await crypto
                .randomBytes(15)
                .toString('hex');
            user.recoverPassCode = recoverPassCode;
            // Lo guardamos en la base de datos
            await updateUserModel({
                id: user.id,
                recoverPassCode: user.recoverPassCode,
            });
        }

        // Generamos un correo electrónico de recuperación
        const mail = generateRecoverPassMailUtil(
            user.username,
            user.recoverPassCode,
        );

        // Enviamos mail
        await sendHtmlMail(
            user.email,
            'Recuperación de contraseña en programa almacén',
            mail,
        );

        res.send({
            status: 'ok',
            message: 'Correo de recuperación enviado',
        });
    } catch (err) {
        next(err);
    }
};

export default passwordSendRecoveryCodeController;
