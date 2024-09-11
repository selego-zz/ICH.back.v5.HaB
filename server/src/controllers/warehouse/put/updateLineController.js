import { updateLinesService } from '../../../services/ordersService.js';
import { validateSchema } from '../../../utils/index.js';
import { invoiceLineUpdateSchema } from '../../../schemas/index.js';

/**
 * Función controladora que actualiza una línea en la base de datoss
 * @middleware authWorkerController - Middleware para comprobar permisos de inserción.
 * @param {Object} req - Objeto request
 * @param {Object} req.body - Json con la información a actualizar
 * @param {string} req.body.type - Tipo del pedido a actualizar
 * @param {string} req.body.series - Serie del pedido a actualizar
 * @param {string} req.body.number - Número del pedido a actualizar
 * @param {number} req.body.line - Número de línea de la línea del pedido a actualizar
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'ok', 'error'
 * @param {string} res.message - Mensaje explicativo de respuesta o de error (Opcional)
 * @param {Function} next - La función de middleware siguiente.
 * @description Llama al servicio `updateLinesService` para actualizar los datos de la línea cuyo tipo, serie, numero y línea coincidan con los suministrados.
 */
const updateLineController = async (req, res, next) => {
    try {
        const body = req.body;
        await validateSchema(invoiceLineUpdateSchema, body);
        await updateLinesService(body);
        res.send({
            status: 'ok',
            message: 'líneas actualizadas',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default updateLineController;
