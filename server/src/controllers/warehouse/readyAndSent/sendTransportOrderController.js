/**
 * Función controladora que envía un correo electrónico a la empresa de transporte con la infomación de recogida
 * @middleware authUserController - Middleware para comprobar permisos de lectura.
 * @param {Object} req - Objeto request
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'ok', 'error'
 * @param {string} [res.message] - Mensaje explicativo de respuesta o de error (Opcional)
 * @param {Function} next - La función de middleware siguiente.
 * @description El controlador llama al servicio `sendTransportOrderService` que es quien envía toda la información
 */

const sendTransportOrderController = (req, res, next) => {
    try {
        res.send({
            status: 'ok',
            message: 'Mensaje enviado',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default sendTransportOrderController;
