const addLinesController = (req, res, next) => {
    try {
        res.send({
            status: 'ok',
            message: 'TODO: addLinesController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default addLinesController;
