const markOrderAsReadyController = (req, res, next) => {
    try {
        res.send({
            status: 'Ok',
            message: 'TODO: markOrderAsReadyController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default markOrderAsReadyController;
