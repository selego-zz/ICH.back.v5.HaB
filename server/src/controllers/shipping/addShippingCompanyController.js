//importamos las dependencias

import { validateSchema, generateErrorUtil } from '../../utils/index.js';
import { shippingCompanySchema } from '../../schemas/index.js';

import {
    removeDefaultOptionModel,
    getShippingByNameModel,
    addShippingModel,
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
const addShippingCompanyController = async (req, res, next) => {
    try {
        //verificamos los datos
        await validateSchema(shippingCompanySchema, req.body);

        //tomamos los datos de la empresa de transporte
        const { name, phone, email, defaultSelection } = req.body;

        //si ya existe, devolvemos un error
        if (getShippingByNameModel(name)?.lenth)
            generateErrorUtil('Empresa de transporte ya existente', 409);

        //si se solicita que sea la empresa de transporte por defecto, ponemos a false el campo en la que lo era antes
        if (defaultSelection) await removeDefaultOptionModel();

        //insertamos la empresa de transporte en la base de datos
        await addShippingModel(name, phone, email, defaultSelection);

        res.status(201).send({
            status: 'ok',
            message: 'Usuario insertado en la base de datos',
        });
    } catch (err) {
        next(err);
    }
};
export default addShippingCompanyController;
