//importamos las dependencias

import { validateSchema, generateError } from '../../utils/index.js';
import { userSchema } from '../../schemas/index.js';
import { getUserByUsernameModel, insertUserModel } from '../../models/index.js';

const addUserController = async (req, res, next) => {
    try {
        //verificamos los datos
        await validateSchema(userSchema, req.body);

        //tomamos los datos del usuario
        const { username, password, email, role } = req.body;

        //comprobamos que no existe un usuario con ese username
        const exist = await getUserByUsernameModel(username);

        if (exist)
            generateError('El usuario ya existe en la base de datos', 409);

        //username y password no son undefinded, por que se ha validado, los otros son opcionales
        await insertUserModel(username, password, email, role);

        res.send({
            status: 'ok',
            message: 'TODO: addUserController',
        });
    } catch (err) {
        next(err);
    }
};
export default addUserController;
