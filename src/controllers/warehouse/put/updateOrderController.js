import { updateOrderService } from '../../../services/ordersService.js';
import { validateSchema } from '../../../utils/index.js';
import { invoiceHeaderUpdateSchema } from '../../../schemas/index.js';

const updateOrderController = async (req, res, next) => {
    try {
        await validateSchema(invoiceHeaderUpdateSchema, req.body);
        const body = req.body;
        await updateOrderService(body);

        res.send({
            status: 'ok',
            message: 'Pedido Actualizado',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default updateOrderController;
