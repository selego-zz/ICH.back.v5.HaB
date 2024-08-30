const addUserController = (req, res, next) => {
    try {
        res.send({
            status: 'ok',
            message: 'TODO: addUserController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default addUserController;
