//importamos dependencias
import { getAllUsersModel } from '../../models/index.js';

/**
 * Función controladora que devuelve toda la información de todos los usuarios
 * @middleware authWorkerController - Middleware para comprobar permisos de lectura.
 * @param {Object} req - Objeto request
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'Ok', 'Error'
 * @param {string} [res.message] - Mensaje explicativo de respuesta o de error (Opcional)
 * @param {Object[]} [res.data] - array de json con toda la información de la tabla usuarios (Opcional)
 * @param {Function} next - La función de middleware siguiente.
 * @description Llama al modelo `getAllUsersModel` para leer toda la información de los usuarios.
 */
const getAllUsersController = async (req, res, next) => {
    try {
        const data = await getAllUsersModel();

        res.send({
            status: 'Ok',
            data,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default getAllUsersController;
