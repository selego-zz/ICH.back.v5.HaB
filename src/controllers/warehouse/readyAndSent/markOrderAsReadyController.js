const markOrderAsReadyController = (req, res, next) => {
    try {
        res.send({
            status: 'ok',
            message: 'TODO: markOrderAsReadyController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default markOrderAsReadyController;
