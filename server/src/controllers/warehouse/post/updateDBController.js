import updateDBService from '../../../services/updateDBService.js';

/**
 * Realiza una copia de la base de datos en el servidor, y actualiza los datos de la base de datos del servidor con la nueva
 * @middleware authWorkerController - Middleware para comprobar permisos de inserción.
 * @param {Object} req - Objeto request
 * @param {Object} res - El objeto de respuesta.
 * @param {string} res.status - Estado de la petición. Valores posibles: 'ok', 'error'
 * @param {string} res.message - Mensaje explicativo de respuesta o de error (Opcional)
 * @param {Function} next - La función de middleware siguiente.
 * @description Copia la base de datos del directorio raíz al servidor, accede a ella, y usa sus datos para actualizar la base de datos del servidor. Finalmente borra la base de datos subida.
 */
const updateDBController = async (req, res, next) => {
    try {
        const dbFile = req.files?.db;

        await updateDBService(dbFile);

        res.status(201).send({
            status: 'ok',
            message: 'Base de datos actualizada',
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

export default updateDBController;
