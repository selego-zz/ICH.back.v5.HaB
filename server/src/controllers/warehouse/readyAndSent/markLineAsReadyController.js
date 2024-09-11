const markLineAsReadyController = (req, res, next) => {
    try {
        res.send({
            status: 'ok',
            message: 'TODO: markLineAsReadyController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default markLineAsReadyController;
