//importamos las dependencias
import { deleteShippingByIdModel } from '../../models/index.js';
import generateError from '../../utils/generateError.js';

/**
 * Función controladora que elimina la información de la empresa de transporte con el id suministrado
 * @middleware authWorkerController - Middleware para comprobar permisos de inserción.
 * @param {Object} req - Objeto request
 * @param {Object} req.params - Parametros de la ruta
 * @param {string} req.params.id - Id de la empresa de trasnporte a eliminar
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'Ok', 'Error'
 * @param {string} res.message - Mensaje explicativo de respuesta o de error
 * @param {Function} next - La función de middleware siguiente.
 * @description - Elimina la información de la empresa de transporte con el id suministrado
 */
const deleteShippingCompanyController = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) generateError('Faltan datos', 400);

        const data = await deleteShippingByIdModel(id);
        let message;
        if (!data) message = 'Empresa de transporte no encontrada';
        else message = 'Empresa de transporte eliminada';
        res.send({
            status: 'Ok',
            message,
        });
    } catch (err) {
        next(err);
    }
};
export default deleteShippingCompanyController;
