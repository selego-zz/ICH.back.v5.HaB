const getOrderController = (req, res, next) => {
    try {
        res.send({
            status: 'ok',
            message: 'TODO: getOrderController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default getOrderController;
