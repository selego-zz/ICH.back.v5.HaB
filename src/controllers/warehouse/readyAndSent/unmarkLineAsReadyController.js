const unmarkLineAsReadyController = (req, res, next) => {
    try {
        res.send({
            status: 'Ok',
            message: 'TODO: unmarkLineAsReadyController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default unmarkLineAsReadyController;
