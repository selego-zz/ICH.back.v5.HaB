//importamos dependencias
import { validateSchema } from '../../../utils/index.js';
import { ordersSchema } from '../../../schemas/index.js';
import { addAllOrdersService } from '../../../services/index.js';
import { generateError } from '../../../utils/index.js';

/**
 * Función controladora que añade un grupo de pedidos a la base de datoss
 * @middleware authWorkerController - Middleware para comprobar permisos de inserción.
 * @param {Object} req - Objeto request
 * @param {Object[]} req.body - Array de Json con toda la información de los pedidos a ingresar
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'ok', 'error'
 * @param {string} [res.message] - Mensaje explicativo de respuesta o de error (Opcional)
 * @param {number[]} [res.data] - Array de id de las cabeceras de los pedidos insertados (Opcional)
 * @param {Function} next - La función de middleware siguiente.
 * @description Llama al servicio `addAllOrdersService` para insertar todos los pedidos suministrados en la base de datos.
 */
const addAllOrdersController = async (req, res, next) => {
    try {
        await validateSchema(ordersSchema, req.body);
        const orders = req.body;

        const headerId = await addAllOrdersService(orders);

        if (!headerId || headerId.length < 1)
            generateError('No se ha insertado ningún pedido', 500);

        res.status(201).send({
            status: 'ok',
            data: { headerId },
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default addAllOrdersController;
