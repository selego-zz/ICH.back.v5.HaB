//importamos dependencias
import { getPool } from '../db/index.js';

const getUserByIdModel = async (id) => {
    try {
        // establecemos conexion a la base de datos
        const pool = await getPool();
        const [user] = await pool.query(
            'SELECT id, password, email, role FROM users WHERE id = ?',
            [id],
        );

        return user[0];
    } catch (err) {
        err.httpStatus = 404;
        throw err;
    }
};

export default getUserByIdModel;
