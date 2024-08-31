const getUserController = (req, res, next) => {
    try {
        //los datos están en req.user
        res.send({
            status: 'ok',
            data: req.user,
        });
    } catch (err) {
        next(err);
    }
};
export default getUserController;
