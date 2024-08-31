//importamos dependencias
import { deleteUserModel } from '../../models/index.js';

const deleteUserController = (req, res, next) => {
    try {
        deleteUserModel(req.params.iduser);
        res.send({
            status: 'ok',
            message: `Usuario ${req.params.iduser} eliminado`,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default deleteUserController;
