//importamos dependencias
import { getPool } from '../../db/index.js';

/**
 * Modelo para solicitar la información de un usuario de la base de datos
 * @param {number} id - Id del usuario cuya información se necesita
 * @description - Busca en la base de datos la información del usuario con el id especificado, y la devuelve como json
 * @returns - Devuelve un json con la información del usuario
 */
const getUserByIdModel = async (id) => {
    try {
        // establecemos conexion a la base de datos
        const pool = await getPool();
        const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [
            id,
        ]);

        return user[0];
    } catch (err) {
        err.httpStatus = 404;
        throw err;
    }
};

export default getUserByIdModel;
