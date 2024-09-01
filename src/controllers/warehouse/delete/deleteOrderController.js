const deleteOrderController = (req, res, next) => {
    try {
        res.send({
            status: 'ok',
            message: 'TODO: deleteOrderController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default deleteOrderController;
