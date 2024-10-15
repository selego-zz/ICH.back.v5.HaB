import { getPool } from '../../db/index.js';
import bcrypt from 'bcrypt';

/**
 * Modelo para modificar los datos de un usuario en la base de datos
 * @param {string} code - Código de recuperación de contraseña
 * @param {string} password - Nueva contraseña del usuario
 * @description - Actualiza en la base de datos la información del usuario con los datos especificados
 */

const passwordResetModel = async (code, password) => {
    const pool = await getPool();
    let sql =
        'UPDATE users SET modifiedAt = NOW(), password = ? where recoverPassCode = ?';

    const newPass = await bcrypt.hash(password, 10);

    const [res] = await pool.query(sql, [newPass, code]);
    return res.affectedRows;
};

export default passwordResetModel;
