import { updateLinesService } from '../../../services/ordersService.js';
import { validateSchema } from '../../../utils/index.js';
import { servedUnitsUpdateSchema } from '../../../schemas/index.js';

/**
 * Función controladora que actualiza en la base de datos la cantidad servida de una línea
 * @middleware authWorkerController - Middleware para comprobar permisos de inserción.
 * @param {Object} req - Objeto request
 * @param {Object} req.body - Json con la información a actualizar
 * @param {string} req.body.type - Tipo del pedido a actualizar
 * @param {string} req.body.series - Serie del pedido a actualizar
 * @param {string} req.body.number - Número del pedido a actualizar
 * @param {number} req.body.line - Número de línea de la línea del pedido a actualizar
 * @param {number} req.body.served_units - Nueva cantidad de producto servida
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'Ok', 'Error'
 * @param {string} res.message - Mensaje explicativo de respuesta o de error (Opcional)
 * @param {Function} next - La función de middleware siguiente.
 * @description Llama al servicio `updateLinesService` para actualizar la cantidad de producto servida/a enviar de la línea cuyo tipo, serie, numero y línea coincidan con los suministrados.
 */
const updateServedUnitsController = async (req, res, next) => {
    try {
        await validateSchema(servedUnitsUpdateSchema, req.body);
        const body = [];
        body.push(req.body);
        await updateLinesService(body);

        res.send({
            status: 'Ok',
            message: 'Cantidad a enviar actualizada',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default updateServedUnitsController;
