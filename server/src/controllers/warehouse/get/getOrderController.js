import { getOrderByNumberService } from '../../../services/index.js';
import { generateErrorUtil } from '../../../utils/index.js';

/**
 * Función controladora que devuelve toda la información de un pedido
 * @middleware authUserController - Middleware para comprobar permisos de lectura.
 * @param {Object} req - Objeto request
 * @param {Object} req.params - Parametros de la ruta
 * @param {string} req.params.type - Tipo del pedido a devolver
 * @param {string} req.params.serie - Serie del pedido a devolver
 * @param {string} req.params.number - Número del pedido a devolver
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'ok', 'error'
 * @param {string} [res.message] - Mensaje explicativo de respuesta o de error (Opcional)
 * @param {Object} [res.data] - json con toda la información del pedido (Opcional)
 * @param {Function} next - La función de middleware siguiente.
 * @description El controlador llama al servicio `getOrderByNumberService` para leer toda la información de un pedido. Si el rol es cliente o agente solo devolverá los datos en caso de que el id corresponda al cliente o agente
 */
const getOrderController = async (req, res, next) => {
    try {
        const { type, series, number } = req.params;
        if (!type || !series || !number) generateErrorUtil('Faltan datos', 400);
        const { role, id } = req.user;

        const data = await getOrderByNumberService(
            type,
            series,
            number,
            role,
            id,
        );

        res.send({
            status: 'ok',
            data,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default getOrderController;
