//importamos dependencias
import { getPool } from '../db/index.js';

const deleteUserModel = async (id) => {
    const pool = await getPool();
    await pool.query('DELETE FROM USERS WHERE ID = ?', [id]);
};

export default deleteUserModel;
