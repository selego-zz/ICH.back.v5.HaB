//importamos dependencias
import { getAllUsersModel } from '../../models/index.js';

const getAllUsersController = async (req, res, next) => {
    try {
        const data = await getAllUsersModel();

        res.send({
            status: 'ok',
            data,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default getAllUsersController;
