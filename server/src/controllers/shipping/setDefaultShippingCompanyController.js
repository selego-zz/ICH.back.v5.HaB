//importamos las dependencias
import {
    removeDefaultOptionModel,
    setDefaultOptionModel,
} from '../../models/index.js';
import generateErrorUtil from '../../utils/generateErrorUtil.js';
/**
 * Función controladora que establece una empresa de transporte como empresa por defecto para envíos
 * @middleware authWorkerController - Middleware para comprobar permisos de inserción.
 * @param {Object} req - Objeto request
 * @param {Object} req.params - Parametros de la ruta
 * @param {string} req.params.id - Id de la empresa de trasnporte a poner como principal
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'ok', 'error'
 * @param {string} res.message - Mensaje explicativo de respuesta o de error
 * @param {Function} next - La función de middleware siguiente.
 * @description - Sustituye la empresa de transporte que estaba establecida como principal por la solicitada
 */
const setDefaultShippingCompanyController = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) generateErrorUtil('Faltan datos', 400);

        await removeDefaultOptionModel();

        //insertamos la empresa de transporte en la base de datos
        await setDefaultOptionModel(id);

        res.status(201).send({
            status: 'ok',
            message: 'Usuario insertado en la base de datos',
        });
    } catch (err) {
        next(err);
    }
};
export default setDefaultShippingCompanyController;
