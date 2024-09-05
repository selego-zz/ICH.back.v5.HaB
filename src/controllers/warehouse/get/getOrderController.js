import { getOrderByNumber } from '../../../services/index.js';

const getOrderController = async (req, res, next) => {
    try {
        const { type, series, number } = req.params;
        const data = await getOrderByNumber(type, series, number);

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
export default getOrderController;
