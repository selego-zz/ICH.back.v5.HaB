//importamos dependencias
import { getPool } from '../../db/index.js';

/**
 * Finds all users
 * @returns a json with all users info
 */
const getAllUsersModel = async () => {
    //iniciamos la base de datos
    const pool = await getPool();

    //tomamos todos los datos de los clientes
    const [clientes] = await pool.query('select * from users');
    return clientes;
};

export default getAllUsersModel;
