//importamos dependencias
import { getPool } from '../../db/index.js';

/**
 * Modelo para solicitar la información de todos los usuarios
 * @description - Devuelve toda la información te la tabla usuarios
 * @returns - Devuelve un array de json con toda la información de la tabla usuarios
 */
const getAllUsersModel = async () => {
    //iniciamos la base de datos
    const pool = await getPool();

    //tomamos todos los datos de los clientes
    const [clientes] = await pool.query(
        'select id, username, email, role from users',
    );
    return clientes;
};

export default getAllUsersModel;
