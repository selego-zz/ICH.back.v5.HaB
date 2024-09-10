//importamos las dependencias

import { validateSchema, generateError } from '../../utils/index.js';
import { userSchema } from '../../schemas/index.js';
import { getUserByUsernameModel, insertUserModel } from '../../models/index.js';

/**
 * Función controladora que añade un usuario en la base de datos
 * @middleware authWorkerController - Middleware para comprobar permisos de inserción.
 * @param {Object} req - Objeto request
 * @param {Object} req.body - Datos del usuario
 * @param {string} req.body.username - Nombre del usuario
 * @param {string} req.body.password - Password del usuario en texto plano
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {string} [req.body.code] - Código del cliente/comercial/empleado (opcional)
 * @param {string} [req.body.role] - El rol del usuario (opcional). Valores posibles: 'administrador', 'empleado', 'cliente', 'comercial'. Valor por defecto: 'cliente'.
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'Ok', 'Error'
 * @param {string} res.message - Mensaje explicativo de respuesta o de error
 * @param {Function} next - La función de middleware siguiente.
 * @description Llama al modelo `insertUserModel` para insertar los datos del usuario en la base de datos.
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

        res.status(201).send({
            status: 'Ok',
            message: 'Usuario insertado en la base de datos',
        });
    } catch (err) {
        next(err);
    }
};
export default addUserController;
