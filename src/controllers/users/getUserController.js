import { getUserByIdModel } from '../../models/index.js';

/**
 * Función controladora que devuelve toda la información del usuario cuyo token se envía en la cabecera
 * @middleware authUserController - Middleware para autenticar al usuario.
 * @param {Object} req - Objeto request
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'Ok', 'Error'
 * @param {string} [res.message] - Mensaje explicativo de respuesta o de error
 * @param {Object} [res.data] - Json con toda la información de la tabla usuarios referente al usuario actual
 * @param {Function} next - La función de middleware siguiente.
 * @description Llama al modelo `getUserByIdModel` para obtener los datos del usuario actual de la base de datos.
 */
const getUserController = async (req, res, next) => {
    try {
        const data = await getUserByIdModel(req.user.id);
        res.send({
            status: 'Ok',
            data,
        });
    } catch (err) {
        next(err);
    }
};
export default getUserController;
