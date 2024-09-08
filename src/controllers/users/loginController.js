//importamos las dependencias
// para encriptar la contraseña
import bcrypt from 'bcrypt';
// para gemerar el web token
import jwt from 'jsonwebtoken';

import { validateSchema, generateError } from '../../utils/index.js';
import { userSchema } from '../../schemas/index.js';
import { getUserByEmailModel } from '../../models/index.js';

/**
 * Función controladora que comprueba los datos de inicio de sesión proporcionados, y de ser correctos devuelve un token de autenticación con el que se podrá identificar al usuario en las diferentes operaciones
 * @param {Object} req - Objeto request
 * @param {Object} req.body - Datos del usuario
 * @param {string} req.body.password - Password del usuario en texto plano
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'Ok', 'Error'
 * @param {string} [res.message] - Mensaje explicativo de respuesta o de error (Opcional)
 * @param {Object} [res.data] - Json con el token de autentificación del usuario (Opcional)
 * @param {Function} next - La función de middleware siguiente.
 * @description Llama al modelo `getUserByEmailModel` para tomar los datos del usuario, valida la contraseña, y genera un jsonwebtoken.
 * @env {string} TOKEN_EXPIRATION - duración del token antes de expirar.
 */
const loginController = async (req, res, next) => {
    try {
        const user = req.body;

        //validamos los datos del usuario con joi
        await validateSchema(userSchema, user);

        //si ha pasado la validación, tenemos como mínimo un usuario y una contraseña
        const dbUser = await getUserByEmailModel(user.username);

        let validPass;
        console.log(dbUser);

        if (dbUser)
            validPass = await bcrypt.compare(user.password, dbUser.password);

        if (!validPass) generateError('Usuario o contraseña incorrectos', 401);

        //en este punto el usuario está logueado, con datos válidos.
        //creamos el token
        const tokenInfo = {
            id: dbUser.id,
            role: dbUser.role,
            email: dbUser.email,
        };
        const token = jwt.sign(tokenInfo, process.env.SECRET, {
            expiresIn: process.env.TOKEN_EXPIRATION,
        });

        res.send({
            status: 'Ok',
            data: token,
        });
    } catch (err) {
        next(err);
    }
};
export default loginController;
