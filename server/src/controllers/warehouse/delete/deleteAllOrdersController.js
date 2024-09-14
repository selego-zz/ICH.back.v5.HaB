import { deleteAllOrdersService } from '../../../services/index.js';

/**
 * Función controladora que elimina todos los pedidos de la base de datos
 * @middleware authUserController - Middleware para comprobar permisos de lectura.
 * @param {Object} req - Objeto request
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'ok', 'error'
 * @param {string} [res.message] - Mensaje explicativo de respuesta o de error (Opcional)
 * @param {Function} next - La función de middleware siguiente.
 * @description El controlador llama al servicio `deleteAllOrdersService` para eliminar todos los pedidos de la base de datos
 */

const deleteAllOrdersController = async (req, res, next) => {
    try {
        await deleteAllOrdersService();
        res.send({
            status: 'ok',
            message: 'Todos los pedidos han sido eliminados',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default deleteAllOrdersController;
