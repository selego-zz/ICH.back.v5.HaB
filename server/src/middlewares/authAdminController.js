//importamos las dependencias
import jwt from 'jsonwebtoken';
import generateErrorUtil from '../utils/generateErrorUtil.js';

// tomamos la clave para desencriptar el token
const { SECRET } = process.env;

/**
 * Middleware para autenticar al usuario.
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} req.headers - Los encabezados de la solicitud.
 * @param {string} req.headers.authorization - El token de autenticación.
 * @param {Object} res - El objeto de respuesta.
 * @param {Function} next - La función de middleware siguiente.
 * @description Verifica el token de autenticación y permite el acceso si es válido y tiene rol de 'administrador'.
 * @env {string} SECRET - La clave secreta para verificar el token de autenticación.
 * @property {Object} req.user - Objeto añadido a req para que esté displonible en los endpoint.
 * @property {string} req.user.id - El ID del usuario.
 * @property {string} req.user.role - El rol del usuario.
 * @property {string} req.user.email - El correo electrónico del usuario.
 */
const authAdminController = (req, res, next) => {
    try {
        //tomamos el token de la cabecera
        const { authorization } = req.headers;
        //si no nos manda el token, lanzamos un error
        if (!authorization)
            generateErrorUtil('Ha de iniciar sesión para continuar', 401);

        try {
            //desencriptamos el token
            const tokenInfo = jwt.verify(authorization, SECRET);
            //si hemos lllegado aquí, el token es correcto
            //lo metemos en req para que esté accesible para los demás
            if (tokenInfo.role !== 'administrador')
                generateErrorUtil(
                    'No tiene permisos necesarios para realizar esa acción',
                    403,
                );
            req.user = tokenInfo;
            next();
        } catch (err) {
            console.error(err);
            generateErrorUtil(
                'No tiene permisos necesarios para realizar esa acción',
                401,
            );
        }
    } catch (err) {
        next(err);
    }
};

export default authAdminController;
