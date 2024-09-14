//importamos las dependencias
import { getShippingByIdModel } from '../../models/index.js';
import generateErrorUtil from '../../utils/generateErrorUtil.js';

/**
 * Función controladora que devuelve la información de la empresa de transporte con el id suministrado
 * @middleware authWorkerController - Middleware para comprobar permisos de inserción.
 * @param {Object} req - Objeto request
 * @param {Object} req.params - Parametros de la ruta
 * @param {string} req.params.id - Id de la empresa de trasnporte a devolver
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'ok', 'error'
 * @param {Object[]} res.data - JSON con la información de la empresa de transporte con el id suministrado
 * @param {Function} next - La función de middleware siguiente.
 * @description - Devuelve un JSON con la información de la empresa de transporte con el id suministrado
 * @returns - JSON con la información de la empresa de transporte con el id suministrado
 */
const getShippingCompanyController = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) generateErrorUtil('Faltan datos', 400);

        const data = getShippingByIdModel(id);
        if (!data)
            generateErrorUtil(
                'no se ha encontrado la empresa de transporte con el id suministrado',
                404,
            );

        res.send({
            status: 'ok',
            data,
        });
    } catch (err) {
        next(err);
    }
};
export default getShippingCompanyController;
