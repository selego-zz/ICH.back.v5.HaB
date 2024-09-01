//importamos las dependencias
import { validateSchema, generateError } from '../../utils/index.js';
import { userUpdateSchema } from '../../schemas/index.js';
import { updateUserModel } from '../../models/index.js';

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
            status: 'ok',
            message: 'datos actualizados',
        });
    } catch (err) {
        next(err);
    }
};

export default updateUserController;
