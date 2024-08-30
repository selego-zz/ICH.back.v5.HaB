const updateLineController = (req, res, next) => {
    try {
        res.send({
            status: 'ok',
            message: 'TODO: updateLineController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default updateLineController;
