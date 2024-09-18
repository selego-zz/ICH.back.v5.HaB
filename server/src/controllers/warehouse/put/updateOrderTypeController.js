import { updateHeadersTypeService } from '../../../services/ordersService.js';

/**
 * Función controladora que actualiza el tipo de un pedido.
 * @middleware authWorkerController - Middleware para comprobar permisos de inserción.
 * @param {Object} req - Objeto request
 * @param {Object} req.params - Parametros con la información del pedido
 * @param {string} req.params.type - Tipo del pedido a actualizar
 * @param {string} req.params.series - Serie del pedido a actualizar
 * @param {string} req.params.number - Número del pedido a actualizar
 * @param {Object} req.body - objeto con la información a actualizar
 * @param {string} req.body.newType - Nuevo tipo del pedido a actualizar. Valores posibles: 'p', 'a', 'f'.
 * @param {Object} req.user - Objeto añadido a req para que esté displonible en los endpoint.
 * @param {string} req.user.id - El ID del usuario.
 * @param {string} req.user.role - El rol del usuario.
 * @param {string} req.user.email - El correo electrónico del usuario.

 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'ok', 'error'
 * @param {string} res.message - Mensaje explicativo de respuesta o de error (Opcional)
 * @param {Function} next - La función de middleware siguiente.
 * @description Llama al servicio `updateLineTypeService` para actualizar el tipo del pedido cuyo tipo, serie y numero coincidan con los suministrados.
 */
const updateOrderTypeController = async (req, res, next) => {
    try {
        const affectedRows = await updateHeadersTypeService(
            req.params.type,
            req.params.series,
            req.params.number,
            req.user.role,
            req.user.id,
            req.body.newType,
        );
        let message = '';
        if (affectedRows > 1) {
            message = `Se han actualizado ${affectedRows} registros`;
        } else if (affectedRows === 1) {
            message = `Se ha actualizado 1 registro`;
        } else {
            message = 'No se han actualizado registros';
        }

        res.send({
            status: 'ok',
            message,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
export default updateOrderTypeController;
