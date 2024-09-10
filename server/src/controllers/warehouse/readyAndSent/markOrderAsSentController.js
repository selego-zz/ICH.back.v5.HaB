const markOrderAsSentController = (req, res, next) => {
    try {
        res.send({
            status: 'Ok',
            message: 'TODO: markOrderAsSentController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default markOrderAsSentController;
