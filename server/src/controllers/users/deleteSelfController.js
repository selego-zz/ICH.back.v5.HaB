//importamos dependencias
import { deleteUserModel } from '../../models/index.js';

/**
 * Función controladora que borra un usuario en la base de datos, tomando el id del usuario a borrar del token de autentificación
 * @middleware authUserController - Middleware para autenticar al usuario.
 * @param {Object} req - Objeto request
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'Ok', 'Error'
 * @param {string} res.message - Mensaje explicativo de respuesta o de error
 * @param {Function} next - La función de middleware siguiente.
 * @description Llama al modelo `deleteUserModel` para borrar los datos del usuario actual de la base de datos.
 */
const deleteSelfController = async (req, res, next) => {
    try {
        await deleteUserModel(req.user.id);
        res.send({
            status: 'Ok',
            message: 'Usuario eliminado',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default deleteSelfController;
