//importamos dependencias
import { getPool } from '../../db/index.js';

/**
 * delete the specified user
 * @param {numer} id - the id of the user you want to delete
 */
const deleteUserModel = async (id) => {
    const pool = await getPool();
    await pool.query('DELETE FROM USERS WHERE ID = ?', [id]);
};

export default deleteUserModel;
