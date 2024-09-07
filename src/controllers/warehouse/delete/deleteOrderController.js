const deleteOrderController = (req, res, next) => {
    try {
        res.send({
            status: 'Ok',
            message: 'TODO: deleteOrderController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default deleteOrderController;
