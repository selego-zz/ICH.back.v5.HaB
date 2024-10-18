import { passwordResetModel } from '../../models/users/index.js';
import { generateErrorUtil } from '../../utils/index.js';

/**
 * Función controladora que actualiza la contraseña del usuario
 * @param {Object} req - Objeto request
 * @param {Object} req.params - Parametros de la ruta
 * @param {number} req.params.recoverPassCode - Código de recuperación de contraseña generado en passwordSendRecoveryCodeController
 * @param {Object} body - cuerpo de la petición
 * @param {string} body.password - Nueva contraseña del usuario
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'ok', 'error'
 * @param {string} res.message - Mensaje explicativo de respuesta o de error
 * @param {number} res.data - Numero de registros eliminados
 * @param {Function} next - La función de middleware siguiente.
 */
const passwordResetController = async (req, res, next) => {
    try {
        const code = req.params.recoverPassCode;
        const password = req.body.password;
        const affectedRows = passwordResetModel(code, password);
        if (affectedRows < 1) generateErrorUtil('Código no encontrado', 404);
        res.send({
            status: 'ok',
            message: 'datos actualizados',
        });
    } catch (err) {
        next(err);
    }
};
export default passwordResetController;
