//importamos dependencias
import { getPool } from '../../db/index.js';

/**
 * Modelo para para borrar un usuario de la base de datos.
 * @param {number} id - Id del usuario a borrar.
 * @description - Borra el usuario especificado por id de la base de datos
 */
const deleteUserModel = async (id) => {
    const pool = await getPool();
    await pool.query('DELETE FROM USERS WHERE ID = ?', [id]);
};

export default deleteUserModel;
