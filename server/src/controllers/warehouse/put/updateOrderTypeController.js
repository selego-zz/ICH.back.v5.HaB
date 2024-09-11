import { updateHeadersTypeService } from '../../../services/ordersService.js';
import { validateSchema } from '../../../utils/index.js';
import { orderTypeSchema } from '../../../schemas/index.js';

/**
 * Función controladora que actualiza el tipo de un pedido.
 * @middleware authWorkerController - Middleware para comprobar permisos de inserción.
 * @param {Object} req - Objeto request
 * @param {Object} req.body - Json con la información a actualizar
 * @param {string} req.body.type - Tipo del pedido a actualizar
 * @param {string} req.body.series - Serie del pedido a actualizar
 * @param {string} req.body.number - Número del pedido a actualizar
 * @param {string} req.body.newType - Nuevo tipo del pedido a actualizar. Valores posibles: 'p', 'a', 'f'.
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'ok', 'error'
 * @param {string} res.message - Mensaje explicativo de respuesta o de error (Opcional)
 * @param {Function} next - La función de middleware siguiente.
 * @description Llama al servicio `updateLineTypeService` para actualizar el tipo del pedido cuyo tipo, serie y numero coincidan con los suministrados.
 */
const updateOrderTypeController = async (req, res, next) => {
    try {
        await validateSchema(orderTypeSchema, req.body);

        await updateHeadersTypeService(
            req.body.type,
            req.body.series,
            req.body.number,
            req.body.newType,
        );

        res.send({
            status: 'ok',
            message: 'Pedido Actualizado',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default updateOrderTypeController;
