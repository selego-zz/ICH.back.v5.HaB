//importamos dependencias
import { validateSchema } from '../../../utils/index.js';
import { ordersSchema } from '../../../schemas/index.js';
import { addAllOrdersService } from '../../../services/index.js';
import { generateError } from '../../../utils/index.js';

const addAllOrdersController = async (req, res, next) => {
    try {
        await validateSchema(ordersSchema, req.body);
        const orders = req.body;

        const headerId = await addAllOrdersService(orders);

        if (!headerId || headerId.length < 1)
            generateError('No se ha insertado ningún pedido', 500);

        res.status(201).send({
            status: 'Ok',
            data: { headerId },
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default addAllOrdersController;
