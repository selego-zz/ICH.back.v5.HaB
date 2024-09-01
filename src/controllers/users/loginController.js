//importamos las dependencias
// para encriptar la contraseña
import bcrypt from 'bcrypt';
// para gemerar el web token
import jwt from 'jsonwebtoken';

import { validateSchema, generateError } from '../../utils/index.js';
import { userSchema } from '../../schemas/index.js';
import { getUserByUsernameModel } from '../../models/index.js';

//OJO: TOKEN_EXPIRATION está en .env
const loginController = async (req, res, next) => {
    try {
        const user = req.body;

        //validamos los datos del usuario con joi
        await validateSchema(userSchema, user);

        //si ha pasado la validación, tenemos como mínimo un usuario y una contraseña
        const dbUser = await getUserByUsernameModel(user.username);

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
            status: 'ok',
            data: token,
        });
    } catch (err) {
        next(err);
    }
};
export default loginController;
