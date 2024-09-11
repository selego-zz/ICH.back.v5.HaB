//importamos dependencias
import { validateSchema } from '../../../utils/index.js';
import { invoiceHeaderSchema } from '../../../schemas/index.js';
import { addOrderService } from '../../../services/index.js';
import { generateError } from '../../../utils/index.js';

/**
 * Función controladora que añade un pedido a la base de datoss
 * @middleware authWorkerController - Middleware para comprobar permisos de inserción.
 * @param {Object} req - Objeto request
 * @param {Object} req.body - Json con toda la información del pedido a ingresar
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'ok', 'error'
 * @param {string} [res.message] - Mensaje explicativo de respuesta o de error (Opcional)
 * @param {Object} [res.data.headerId] - Id de la cabecera del pedido insertado (Opcional)
 * @param {Function} next - La función de middleware siguiente.
 * @description Llama al servicio `addAllOrdersService` para insertar todos los pedidos suministrados en la base de datos.
 */
const addOrderController = async (req, res, next) => {
    try {
        await validateSchema(invoiceHeaderSchema, req.body);
        const orders = req.body;

        const headerId = await addOrderService(orders);

        if (!headerId) generateError('No se ha insertado ningún pedido', 500);

        res.status(201).send({
            status: 'ok',
            data: { headerId },
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default addOrderController;
