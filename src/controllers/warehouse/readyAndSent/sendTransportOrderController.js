const sendTransportOrderController = (req, res, next) => {
    try {
        res.send({
            status: 'ok',
            message: 'TODO: sendTransportOrderController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default sendTransportOrderController;
