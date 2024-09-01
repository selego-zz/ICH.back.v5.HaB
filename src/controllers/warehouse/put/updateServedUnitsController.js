const updateServedUnitsController = (req, res, next) => {
    try {
        res.send({
            status: 'ok',
            message: 'TODO: updateServedUnitsController',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default updateServedUnitsController;
