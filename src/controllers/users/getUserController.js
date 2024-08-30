const getUserController = (req, res, next) => {
    try {
        res.send({
            status: 'ok',
            message: 'TODO: getUserController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default getUserController;
