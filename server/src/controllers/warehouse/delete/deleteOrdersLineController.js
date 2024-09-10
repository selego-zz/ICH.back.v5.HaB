import { deleteOrdersLineByNumerService } from '../../../services/index.js';
import { generateError } from '../../../utils/index.js';
/**
 * Función controladora que elimina una línea de la base de datos
 * @middleware authUserController - Middleware para comprobar permisos de lectura.
 * @param {Object} req - Objeto request
 * @param {Object} req.params - Parametros de la ruta
 * @param {string} req.params.type - Tipo del pedido cuya línea queremos eliminar
 * @param {string} req.params.serie - Serie del pedido cuya línea queremos eliminar
 * @param {string} req.params.number - Número del pedido cuya línea queremos eliminar
 * @param {number} req.params.line - número de línea de la línea que queremos eliminar
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'Ok', 'Error'
 * @param {string} [res.message] - Mensaje explicativo de respuesta o de error (Opcional)
 * @param {Function} next - La función de middleware siguiente.
 * @description El controlador llama al servicio `deleteOrdersLineByNumerService` para eliminar una línea de la base de datos
 */
const deleteOrderLineController = async (req, res, next) => {
    try {
        const { type, series, number, line } = req.params;
        if (!type || !series || !number || !line)
            generateError('Faltan datos', 400);

        await deleteOrdersLineByNumerService(type, series, number, line);

        res.send({
            status: 'Ok',
            message: 'Línea eliminada',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default deleteOrderLineController;
