const deleteAllOrdersController = (req, res, next) => {
    try {
        res.send({
            status: 'Ok',
            message: 'TODO: deleteAllOrdersController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default deleteAllOrdersController;
