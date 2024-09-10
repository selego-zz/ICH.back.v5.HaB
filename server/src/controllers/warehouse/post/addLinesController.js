//importamos dependencias
import { validateSchema } from '../../../utils/index.js';
import { allLinesSchema } from '../../../schemas/index.js';
import { addLinesService } from '../../../services/index.js';
import { generateError } from '../../../utils/index.js';

/**
 * Función controladora que añade un grupo de líneas al pedido indicado en la base de datoss
 * @middleware authWorkerController - Middleware para comprobar permisos de inserción.
 * @param {Object} req - Objeto request
 * @param {Object} req.params - Parametros de la ruta
 * @param {string} req.params.type - Tipo del pedido en el que insertar las líneas
 * @param {string} req.params.serie - Serie del pedido en el que insertar las líneas
 * @param {string} req.params.number - Número del pedido en el que insertar las líneas
 * @param {Object[]} req.body - Array de Json con toda la información de las líneas a insertar
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'Ok', 'Error'
 * @param {string} res.message - Mensaje explicativo de respuesta o de error (Opcional)
 * @param {Function} next - La función de middleware siguiente.
 * @description Llama al servicio `addLinesService` para insertar todas las lineas en la base de datos.
 */
const addLinesController = async (req, res, next) => {
    try {
        await validateSchema(allLinesSchema, req.body);

        const lines = req.body;
        const { type, series, number } = req.params;
        if (!type || !series || !number || !lines)
            generateError('Faltan datos', 400);

        await addLinesService(type, series, number, lines);

        res.status(201).send({
            status: 'Ok',
            message: 'Lineas insertadas',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default addLinesController;
