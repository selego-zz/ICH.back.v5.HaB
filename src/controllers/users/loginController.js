//importamos las dependencias
// para encriptar la contraseña
import bcrypt from 'bcrypt';
// para gemerar el web token
import jwt from 'jsonwebtoken';
import validateSchema from '../../utils/validateSchema.js';
import userSchema from '../../schemas/userSchema.js';
import getPool from '../../db/getPool.js';
import generateError from '../../utils/generateError.js';

//OJO: TOKEN_EXPIRATION está en .env
const loginController = async (req, res, next) => {
    try {
        const user = req.body;

        //validamos los datos del usuario con joi
        await validateSchema(userSchema, user);

        const pool = await getPool();

        //si ha pasado la validación, tenemos como mínimo un usuario y una contraseña
        const [[{ password }]] = await pool.query(
            'SELECT password FROM users WHERE username = ?',
            [user.username],
        );
        let validPass;

        if (password.length > 0)
            validPass = await bcrypt.compare(password, user.password);

        if (!validPass) generateError('Usuario o contraseña incorrectos', 401);

        res.send({
            status: 'ok',
            message: 'TODO: loginController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default loginController;
