const loginController = (req, res, next) => {
    try {
        //OJO: TOKEN_EXPIRATION está en .env

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
