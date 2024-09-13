//importamos las dependencias

import { validateSchema, generateErrorUtil } from '../../utils/index.js';
import { shippingCompanyUpdateSchema } from '../../schemas/index.js';

import {
    getShippingByNameModel,
    updateShippingModel,
} from '../../models/index.js';

/**
 * Función controladora que añade una empresa de transporte a la base de datos
 * @middleware authWorkerController - Middleware para comprobar permisos de inserción.
 * @param {Object} req - Objeto request
 * @param {Object} req.body - Datos de la empresa de transporte.
 * @param {string} req.body.name - Nombre de la empresa de transporte.
 * @param {string} req.body.phone - teléfono de la empresa de transporte.
 * @param {string} req.body.email - Correo electrónico de la empresa de transporte.
 * @param {boolean} req.body.defaultSelection - Establece si es la empresa de transporte que se selecciona para los envíos.
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'ok', 'error'
 * @param {string} res.message - Mensaje explicativo de respuesta o de error
 * @param {Function} next - La función de middleware siguiente.
 * @description Inserta la empresa de transporte en la base de datos directamente mediante el uso de los modelos. Si defaultSelection está establecido como true, pone en false la que estuviera en true anteriormente
 */
const updateShippingCompanyController = async (req, res, next) => {
    try {
        //verificamos los datos
        await validateSchema(shippingCompanyUpdateSchema, req.body);

        //tomamos los datos de la empresa de transporte
        const { id, name, phone, email } = req.body;

        //si ya existe, devolvemos un error
        if (getShippingByNameModel(name)?.id !== id)
            generateErrorUtil('Ya existe otra empresa con ese nombre', 409);

        //insertamos la empresa de transporte en la base de datos
        await updateShippingModel(name, phone, email);

        res.status(201).send({
            status: 'ok',
            message: 'Usuario insertado en la base de datos',
        });
    } catch (err) {
        next(err);
    }
};
export default updateShippingCompanyController;
