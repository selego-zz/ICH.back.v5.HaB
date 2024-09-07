//importamos las dependencias
import { validateSchema, generateError } from '../../utils/index.js';
import { userUpdateSchema } from '../../schemas/index.js';
import { updateUserModel } from '../../models/index.js';

/**
 * Función controladora que actualiza los datos de un usuario en la base de datos
 * @middleware authUserController - Middleware para comprobar permisos de inserción.
 * @param {Object} req - Objeto request
 * @param {Object} req.body - Datos del usuario
 * @param {Object} req.params - Parametros de la ruta
 * @param {string} req.params.iduser - Id del usuario a actualizar
 * @param {string} [req.body.username] - Nombre del usuario
 * @param {string} [req.body.password ]- Password del usuario en texto plano
 * @param {string} [req.body.email] - Correo electrónico del usuario
 * @param {string} [req.body.code] - Código del cliente/comercial/empleado (opcional)
 * @param {string} [req.body.role] - El rol del usuario (opcional). Valores posibles: 'administrador', 'empleado', 'cliente', 'comercial'. Valor por defecto: 'cliente'.
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'Ok', 'Error'
 * @param {string} res.message - Mensaje explicativo de respuesta o de error
 * @param {Function} next - La función de middleware siguiente.
 * @description En caso de que req.params.iduser corresponda con los datos del token de autenticación, o este tenga rol de administrador Llama al modelo `updateUserModel` para actualizar los datos del usuario en la base de datos.
 */
const updateUserController = async (req, res, next) => {
    try {
        const user = req.user;
        const iduser = req.params.iduser;

        if (user.id != iduser && user.role !== 'administrador')
            generateError('No tienes permisos para realizar la acción', 401);

        await validateSchema(userUpdateSchema, req.body);

        const { username, password, email, code, role } = req.body;
        await updateUserModel(iduser, username, password, email, code, role);

        res.send({
            status: 'Ok',
            message: 'datos actualizados',
        });
    } catch (err) {
        next(err);
    }
};

export default updateUserController;
