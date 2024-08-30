const getAllUsersController = (req, res, next) => {
    try {
        res.send({
            status: 'ok',
            message: 'TODO: getAllUsersController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default getAllUsersController;
