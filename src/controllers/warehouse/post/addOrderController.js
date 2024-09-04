//importamos dependencias
import { validateSchema } from '../../../utils/index.js';
import { ordersSchema } from '../../../schemas/index.js';
import { addOrderModel } from '../../../models/warehouse/index.js';

const addOrderController = async (req, res, next) => {
    try {
        await validateSchema(ordersSchema, req.body);
        const orders = req.body;

        orders.forEach((order) => {
            addOrderModel(order);
        });

        res.send({
            status: 'ok',
            data: req.body,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default addOrderController;
