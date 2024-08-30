const getAllOrdersController = (req, res, next) => {
    try {
        res.send({
            status: 'ok',
            message: 'TODO: getAllOrdersController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default getAllOrdersController;
