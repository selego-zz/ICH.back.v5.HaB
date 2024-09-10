import { updateOrderService } from '../../../services/ordersService.js';
import { validateSchema } from '../../../utils/index.js';
import { invoiceHeaderUpdateSchema } from '../../../schemas/index.js';

/**
 * Función controladora que actualiza un pedido en la base de datos
 * @middleware authWorkerController - Middleware para comprobar permisos de inserción.
 * @param {Object} req - Objeto request
 * @param {Object} req.body - Json con la información a actualizar
 * @param {string} req.body.type - Tipo del pedido a actualizar
 * @param {string} req.body.series - Serie del pedido a actualizar
 * @param {string} req.body.number - Número del pedido a actualizar
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'Ok', 'Error'
 * @param {string} res.message - Mensaje explicativo de respuesta o de error (Opcional)
 * @param {Function} next - La función de middleware siguiente.
 * @description Llama al servicio `updateOrderService` para actualizar los datos depedido cuyo tipo, serie y numero coincidan con los suministrados. Si el pedido tiene líneas que no estaban en el original, las inserta, las que ya existen las modifica, pero no borra otras que ya tuviera
 */
const updateOrderController = async (req, res, next) => {
    try {
        await validateSchema(invoiceHeaderUpdateSchema, req.body);
        const body = req.body;
        await updateOrderService(body);

        res.send({
            status: 'Ok',
            message: 'Pedido Actualizado',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default updateOrderController;
