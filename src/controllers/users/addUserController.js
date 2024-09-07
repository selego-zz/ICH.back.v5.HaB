//importamos las dependencias

import { validateSchema, generateError } from '../../utils/index.js';
import { userSchema } from '../../schemas/index.js';
import { getUserByUsernameModel, insertUserModel } from '../../models/index.js';

/**
 * Función controladora que añade un usuario en la base de datos
 * @param {object} req - Objeto request
 * @param {object} req.body - datos del usuario
 * @param {string} req.body.username - Nombre del usuario
 * @param {string} req.body.password - Password del usuario en texto plano
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {string} [req.body.code] - Código del cliente/comercial/empleado (opcional)
 * @param {string} [req.body.role] - El rol del usuario (opcional). Valores posibles: 'administrador', 'empleado', 'cliente', 'comercial'. Valor por defecto: 'cliente'.
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'ok', 'Error'
 * @param {Object} res - El objeto de respuesta.
 * @param {*} next
 */
const addUserController = async (req, res, next) => {
    try {
        //verificamos los datos
        await validateSchema(userSchema, req.body);

        //tomamos los datos del usuario
        const { username, password, email, code, role } = req.body;

        //comprobamos que no existe un usuario con ese username
        const exist = await getUserByUsernameModel(username);

        if (exist)
            generateError('El usuario ya existe en la base de datos', 409);

        //username y password no son undefinded, por que se ha validado, los otros son opcionales
        await insertUserModel(username, password, email, code, role);

        res.send({
            status: 'Ok',
            message: 'TODO: addUserController',
        });
    } catch (err) {
        next(err);
    }
};
export default addUserController;
