const unmarkOrderAsSentController = (req, res, next) => {
    try {
        res.send({
            status: 'Ok',
            message: 'TODO: unmarkOrderAsSentController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default unmarkOrderAsSentController;
