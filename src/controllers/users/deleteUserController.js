const deleteUserController = (req, res, next) => {
    try {
        res.send({
            status: 'ok',
            message: 'TODO: deleteUserController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default deleteUserController;
