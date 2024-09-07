//importamos dependencias
import { deleteUserModel } from '../../models/index.js';

const deleteSelfController = async (req, res, next) => {
    try {
        await deleteUserModel(req.user.id);
        res.send({
            status: 'Ok',
            message: 'Usuario eliminado',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default deleteSelfController;
