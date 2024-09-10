//importamos las dependencias
import { getShippingCompaniesModel } from '../../models/index.js';
import generateError from '../../utils/generateError.js';

/**
 * Función controladora que devuelve la información de todas las empresas de transporte
 * @middleware authWorkerController - Middleware para comprobar permisos de inserción.
 * @param {Object} req - Objeto request
 * @param {Object} req.body - Datos de la empresa de transporte.
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'Ok', 'Error'
 * @param {Object[]} res.data - Array de JSON con la información de todas las empresas de transporte
 * @param {Function} next - La función de middleware siguiente.
 * @description - Devuelve la información de todas las empresas de transporte
 * @returns - Devuelve la información de todas las empresas de transporte
 */
const getAllShippingCompanyController = async (req, res, next) => {
    try {
        const data = getShippingCompaniesModel();
        if (!data || data.length < 1)
            generateError('no se encontraron empresas de transporte', 404);

        res.send({
            status: 'Ok',
            data,
        });
    } catch (err) {
        next(err);
    }
};
export default getAllShippingCompanyController;
