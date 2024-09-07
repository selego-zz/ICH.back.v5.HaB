const deleteOrderLineController = (req, res, next) => {
    try {
        res.send({
            status: 'Ok',
            message: 'TODO: deleteOrderLineController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default deleteOrderLineController;
