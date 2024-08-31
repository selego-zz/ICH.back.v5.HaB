//importamos las dependencias
import bcrypt from 'bcrypt';
import { getPool } from '../db/index.js';
import { generateError } from '../utils/index.js';
/**
 *     INSERT INTO users
 *         (username, password, email, role)
 *         VALUES
 *         (?, ?, 'administrador')
 */

const insertUserModel = async (username, password, email, role) => {
    // tomamos el pool de la base de datos
    const pool = await getPool();

    //comprobamos que no exista ni el usuario, ni el email (caso de que suministren email)
    let [resultado] = await pool.query(
        'SELECT id FROM users WHERE username = ?',
        [username],
    );

    if (resultado.length)
        generateError('Ya existe un usuario con ese nombre de usuario', 409);

    const args = [username, await bcrypt.hash(password, 10)];
    let SQL = `INSERT INTO users (username, password`;

    if (email) {
        [resultado] = await pool.query('SELECT id FROM users WHERE email = ?', [
            email,
        ]);
        if (resultado.length)
            generateError(
                'Ya existe un usuario con ese correo electrónico',
                409,
            );
        SQL += `, email`;
        args.push(email);
    }

    if (role) {
        SQL += `, role`;
        args.push(role);
    }

    SQL += `) VALUES (?, ?`;
    if (args.length > 2) SQL += `, ?`;
    if (args.length > 3) SQL += `, ?`;
    SQL += `)`;

    [resultado] = await pool.query(SQL, args);

    return resultado.insertId;
};
export default insertUserModel;
