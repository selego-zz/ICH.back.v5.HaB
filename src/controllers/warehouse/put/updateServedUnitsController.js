import { updateLinesService } from '../../../services/ordersService.js';
import { validateSchema } from '../../../utils/index.js';
import { servedUnitsUpdateSchema } from '../../../schemas/index.js';

const updateServedUnitsController = async (req, res, next) => {
    try {
        await validateSchema(servedUnitsUpdateSchema, req.body);
        const body = [];
        body.push(req.body);
        await updateLinesService(body);

        res.send({
            status: 'ok',
            message: 'Cantidad a enviar actualizada',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default updateServedUnitsController;
