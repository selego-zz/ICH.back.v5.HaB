//importamos dependencias
import { getAllUsersModel } from '../../models/index.js';

/**
 * Función controladora que devuelve toda la información de todos los usuarios.
 * @middleware authWorkerController - Middleware para comprobar permisos de lectura.
 * @param {Object} req - Objeto request.
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Respuesta: Estado de la petición. Valores posibles: 'ok', 'error'.
 * @param {string} [res.message] - Respuesta: Mensaje explicativo de respuesta o de error (Opcional).
 * @param {Object[]} [res.data] - Respuesta: array de json con toda la información de la tabla usuarios (Opcional).
 * @param {number} res.data[].id - ID del usuario.
 * @param {string} res.data[].username - Nombre de usuario.
 * @param {string} res.data[].password - Contraseña del usuario.
 * @param {string} res.data[].email - Correo electrónico del usuario.
 * @param {string} res.data[].code - Código del usuario.
 * @param {string} res.data[].role - Rol del usuario. Valores posibles: 'administrador', 'empleado', 'cliente', 'comercial'.
 * @param {string} res.data[].avatar - URL del avatar del usuario.
 * @param {string} res.data[].createdAt - Fecha de creación del usuario.
 * @param {string} res.data[].modifiedAt - Fecha de última modificación del usuario.
 * @param {Function} next - La función de middleware siguiente.
 * @description Llama al modelo `getAllUsersModel` para leer toda la información de los usuarios.
 */
const getAllUsersController = async (req, res, next) => {
    try {
        const data = await getAllUsersModel();

        res.send({
            status: 'ok',
            data,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default getAllUsersController;
