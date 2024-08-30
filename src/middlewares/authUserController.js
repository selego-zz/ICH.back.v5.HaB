//importamos las dependencias
import jwt from 'jsonwebtoken';
import generateError from '../utils/generateError.js';

// tomamos la clave para desencriptar el token
const { SECRET } = process.env;

//funcion controladora que desencripta el token
//// si no hay tokem lanza un error
//// si hay token lo introduce en req.user
const authUserController = (req, res, next) => {
    try {
        //tomamos el token de la cabecera
        const { authorization } = req.headers;
        //si no nos manda el token, lanzamos un error
        if (!authorization)
            generateError('Ha de iniciar sesión para continuar', 401);

        try {
            //desencriptamos el token
            const tokenInfo = jwt.verify(authorization, SECRET);
            //si hemos lllegado aquí, el token es correcto
            //lo metemos en req para que esté accesible para los demás
            req.user = tokenInfo;
            next();
        } catch (err) {
            console.error(err);
            generateError('token inválido', 401);
        }
    } catch (err) {
        next(err);
    }
};

export default authUserController;
