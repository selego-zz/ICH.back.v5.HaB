import { updateLineCompletedService } from '../../../services/ordersService.js';
import { validateSchema } from '../../../utils/index.js';
import { lineCompletedSchema } from '../../../schemas/index.js';

/**
 * Función controladora que actualiza el tipo de una línea.
 * @middleware authWorkerController - Middleware para comprobar permisos de inserción.
 * @param {Object} req - Objeto request
 * @param {Object} req.body - Json con la información a actualizar
 * @param {string} req.body.type - Tipo de la línea a actualizar
 * @param {string} req.body.series - Serie de la línea a actualizar
 * @param {string} req.body.number - Número de la línea a actualizar
 * @param {boolean} req.body.completed - Establece si la línea está completa o no.
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'ok', 'error'
 * @param {string} res.message - Mensaje explicativo de respuesta o de error (Opcional)
 * @param {Function} next - La función de middleware siguiente.
 * @description Llama al servicio `updateLineCompletedService` para actualizar el tipo de la línea cuyo tipo, serie y numero coincidan con los suministrados.
 */
const updateLineCompletedController = async (req, res, next) => {
    try {
        await validateSchema(lineCompletedSchema, req.body);

        await updateLineCompletedService(
            req.body.type,
            req.body.series,
            req.body.number,
            req.body.completed,
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
export default updateLineCompletedController;
