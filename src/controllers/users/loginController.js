const loginController = (req, res, next) => {
    try {
        res.send({
            status: 'ok',
            message: 'TODO: loginController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default loginController;
