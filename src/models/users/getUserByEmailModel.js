//importamos dependencias
import { getPool } from '../../db/index.js';

/**
 * Finds the info of a user based on his username
 * @param {string} email - The email of the user you are wanting
 * @returns a json with the user info
 */

const getUserByEmailModel = async (email) => {
    try {
        // establecemos conexion a la base de datos
        const pool = await getPool();
        const [user] = await pool.query(
            'SELECT id, password, email, role FROM users WHERE email = ?',
            [email],
        );

        return user[0];
    } catch (err) {
        err.httpStatus = 404;
        throw err;
    }
};

export default getUserByEmailModel;
