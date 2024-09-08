import { getAllOrdersService } from '../../../services/index.js';

/**
 * Función controladora que devuelve toda la información de todos los pedidos
 * @middleware authUserController - Middleware para comprobar permisos de lectura.
 * @param {Object} req - Objeto request
 * @param {Object} req.params - Parametros de la ruta
 * @param {string} [req.params.type] - Tipo de los pedidos a devolver. Si no se especifica nada, devuelve todos (Opcional)
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'Ok', 'Error'
 * @param {string} [res.message] - Mensaje explicativo de respuesta o de error (Opcional)
 * @param {Object[]} [res.data] - array de json con toda la información de los pedidos (Opcional)
 * @param {Function} next - La función de middleware siguiente.
 * @description El controlador llama al servicio `getAllOrdersService` para leer toda la información de los pedidos. Si el rol es cliente o agente, los pedidos se reducen a los de ese cliente o de ese agente.
 */
const getAllOrdersController = async (req, res, next) => {
    try {
        const { type } = req.params;
        const { role, id } = req.user;
        const data = await getAllOrdersService(type, role, id);
        res.send({
            status: 'Ok',
            data,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default getAllOrdersController;
