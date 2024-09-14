//importamos las dependencias
import {
    validateSchema,
    generateErrorUtil,
    savePhotoUtil,
} from '../../utils/index.js';
import { userUpdateSchema } from '../../schemas/index.js';
import { updateUserModel, getUserByIdModel } from '../../models/index.js';
import { removePhotoUtil } from '../../utils/index.js';

/**
 * Función controladora que actualiza los datos de un usuario en la base de datos
 * @middleware authUserController - Middleware para comprobar permisos de escritura.
 * @param {Object} req - Objeto request
 * @param {Object} req.body - Datos del usuario
 * @param {Object} req.params - Parametros de la ruta
 * @param {number} req.params.iduser - Id del usuario a actualizar
 * @param {string} [req.body.username] - Nombre del usuario (Opcional)
 * @param {string} [req.body.password ] - Password del usuario en texto plano (Opcional)
 * @param {string} [req.body.email] - Correo electrónico del usuario (Opcional)
 * @param {string} [req.body.avatar] - Avatar del usuario (Opcional)
 * @param {string} [req.body.code] - Código del cliente/comercial/empleado (opcional)
 * @param {string} [req.body.role] - El rol del usuario (opcional). Valores posibles: 'administrador', 'empleado', 'cliente', 'comercial'. Valor por defecto: 'cliente'.
 * @param {File} [req.files.avatar] - El avatar del usuario (opcional).
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'ok', 'error'
 * @param {string} res.message - Mensaje explicativo de respuesta o de error
 * @param {Object} [res.data] - Json con toda la información de la tabla usuarios referente al usuario actual (Opcional)
 * @param {Function} next - La función de middleware siguiente.
 * @description En caso de que req.params.iduser corresponda con los datos del token de autenticación, o este tenga rol de administrador Llama al modelo `updateUserModel` para actualizar los datos del usuario en la base de datos.
 */
const updateUserController = async (req, res, next) => {
    try {
        console.log('headers');
        console.log(req.headers['content-type']);

        console.log('files');
        console.log(req.files);

        console.log('body');
        console.log(req.body);

        console.log(req.body.avatar);

        const user = req.user;
        const iduser = req.params.iduser;

        if (user.id != iduser && user.role !== 'administrador')
            generateErrorUtil(
                'No tienes permisos para realizar la acción',
                401,
            );

        await validateSchema(userUpdateSchema, req.body);

        const { username, password, email, code, role } = req.body;
        const avatarFile = req.files?.avatar;
        let avatar = null;
        if (avatarFile) {
            const { oldAvatar } = getUserByIdModel(iduser);
            if (oldAvatar) await removePhotoUtil(oldAvatar);
            avatar = await savePhotoUtil(avatarFile, 150);
        }

        await updateUserModel(
            iduser,
            username,
            password,
            email,
            code,
            role,
            avatar,
        );

        const data = await getUserByIdModel(iduser);

        res.send({
            status: 'ok',
            message: 'datos actualizados',
            data,
        });
    } catch (err) {
        next(err);
    }
};

export default updateUserController;
