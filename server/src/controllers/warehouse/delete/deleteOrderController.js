import { deleteOrderService } from '../../../services/index.js';
import { generateErrorUtil } from '../../../utils/index.js';
/**
 * Función controladora que elimina un pedido de la base de datos
 * @middleware authUserController - Middleware para comprobar permisos de lectura.
 * @param {Object} req - Objeto request
 * @param {Object} req.params - Parametros de la ruta
 * @param {string} req.params.type - Tipo del pedido a eliminar
 * @param {string} req.params.serie - Serie del pedido a eliminar
 * @param {string} req.params.number - Número del pedido a eliminar
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'ok', 'error'
 * @param {string} [res.message] - Mensaje explicativo de respuesta o de error (Opcional)
 * @param {Function} next - La función de middleware siguiente.
 * @description El controlador llama al servicio `deleteOrderService` para eliminar un pedido de la base de datos
 */
const deleteOrderController = async (req, res, next) => {
    try {
        const { type, series, number } = req.params;
        if (!type || !series || !number) generateErrorUtil('Faltan datos', 400);

        await deleteOrderService(type, series, number);

        res.send({
            status: 'ok',
            message: 'Pedido Eliminado',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default deleteOrderController;
