const unmarkOrderAsReadyController = (req, res, next) => {
    try {
        res.send({
            status: 'Ok',
            message: 'TODO: unmarkOrderAsReadyController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default unmarkOrderAsReadyController;
