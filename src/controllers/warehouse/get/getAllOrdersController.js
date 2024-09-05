import { getAllOrdersService } from '../../../services/index.js';
const getAllOrdersController = async (req, res, next) => {
    try {
        const { type } = req.params;
        const data = await getAllOrdersService(type);
        res.send({
            status: 'ok',
            message: 'consulta realizada',
            data,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default getAllOrdersController;
