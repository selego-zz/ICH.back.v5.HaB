//importamos dependencias
import { validateSchema } from '../../../utils/index.js';
import { allLinesSchema } from '../../../schemas/index.js';
import { addLinesService } from '../../../services/index.js';

const addLinesController = async (req, res, next) => {
    try {
        await validateSchema(allLinesSchema, req.body);

        const lines = req.body;
        const { type, series, number } = req.params;

        await addLinesService(type, series, number, lines);

        res.status(201).send({
            status: 'ok',
            message: 'Linas insertadas',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default addLinesController;
