import { updateLineCompletedService } from '../../../services/ordersService.js';

/**
 * Función controladora que actualiza el tipo de una línea.
 * @middleware authWorkerController - Middleware para comprobar permisos de inserción.
 * @param {Object} req - Objeto request
 * @param {Object} req.params - Parámetros de ruta
 * @param {string} req.params.type - Tipo de la línea a actualizar
 * @param {string} req.params.series - Serie de la línea a actualizar
 * @param {string} req.params.number - Número del pedido de la línea a actualizar
 * @param {integer} req.params.line - Número de línea de la línea a actualizar
 * @param {Object} req.body - Json con la información a actualizar
 * @param {boolean} req.body.completed - Establece si la línea está completa o no.
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'ok', 'error'
 * @param {string} res.message - Mensaje explicativo de respuesta o de error (Opcional)
 * @param {Function} next - La función de middleware siguiente.
 * @description Llama al servicio `updateLineCompletedService` para actualizar el tipo de la línea cuyo tipo, serie y numero coincidan con los suministrados.
 */
const updateLineCompletedController = async (req, res, next) => {
    try {
        //No hace falta comprobar roles o ids, a este punto solo puede llegar un empleado o administrador, unicos roles que pueden cambiar este campo
        console.log(req.body.completed);

        const affectedRows = await updateLineCompletedService(
            req.params.type,
            req.params.series,
            req.params.number,
            req.params.line,
            req.body.completed,
        );
        let message = '';
        if (affectedRows > 1) {
            message = `Se han actualizado ${affectedRows} registros`;
        } else if (affectedRows === 1) {
            message = `Se ha actualizado 1 registro`;
        } else {
            message = 'No se han actualizado registros';
        }

        res.send({
            status: 'ok',
            message,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default updateLineCompletedController;
