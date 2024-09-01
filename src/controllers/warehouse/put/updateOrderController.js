const updateOrderController = (req, res, next) => {
    try {
        res.send({
            status: 'ok',
            message: 'TODO: updateOrderController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default updateOrderController;
