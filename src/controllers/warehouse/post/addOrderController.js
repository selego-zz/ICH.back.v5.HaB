const addOrderController = (req, res, next) => {
    try {
        res.send({
            status: 'ok',
            message: 'TODO: addOrderController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default addOrderController;
