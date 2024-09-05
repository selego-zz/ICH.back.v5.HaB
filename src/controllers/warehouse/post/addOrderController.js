//importamos dependencias
import { validateSchema } from '../../../utils/index.js';
import { invoiceHeaderSchema } from '../../../schemas/index.js';
import { addOrderService } from '../../../services/index.js';
import { generateError } from '../../../utils/index.js';

const addOrderController = async (req, res, next) => {
    try {
        await validateSchema(invoiceHeaderSchema, req.body);
        const orders = req.body;

        const headerId = await addOrderService(orders);

        if (!headerId) generateError('No se ha insertado ningún pedido', 500);

        res.status(201).send({
            status: 'ok',
            data: { headerId },
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default addOrderController;
