const addOrderController = (req, res, next) => {
    try {
        console.log(req.body);

        res.send({
            status: 'ok',
            data: req.body,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default addOrderController;
