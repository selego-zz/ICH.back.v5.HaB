import { updateLinesService } from '../../../services/ordersService.js';
import { validateSchema } from '../../../utils/index.js';
import { invoiceLineUpdateSchema } from '../../../schemas/index.js';

const updateLineController = async (req, res, next) => {
    try {
        await validateSchema(invoiceLineUpdateSchema, req.body);
        const body = [];
        body.push(req.body);
        await updateLinesService(body);
        res.send({
            status: 'ok',
            message: 'líneas actualizadas',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default updateLineController;
