const deleteSelfController = (req, res, next) => {
    try {
        res.send({
            status: 'ok',
            message: 'TODO: deleteSelfController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default deleteSelfController;
