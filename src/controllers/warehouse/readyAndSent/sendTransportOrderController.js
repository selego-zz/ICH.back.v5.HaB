const sendTransportOrderController = (req, res, next) => {
    try {
        res.send({
            status: 'Ok',
            message: 'TODO: sendTransportOrderController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default sendTransportOrderController;
