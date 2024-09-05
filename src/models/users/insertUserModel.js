//importamos las dependencias
import bcrypt from 'bcrypt';
import { getPool } from '../../db/index.js';
import { generateError } from '../../utils/index.js';

/**
 * insert an user into the database
 * @param {string} username - username of the user
 * @param {string} password - password in plain text of the user
 * @param {string} email - email of the user
 * @param {string} code - code of the user if aplies
 * @param {string} role - role of the user, default client
 * @returns inserted user id
 */
const insertUserModel = async (username, password, email, code, role) => {
    // tomamos el pool de la base de datos
    const pool = await getPool();

    /*
     *     INSERT INTO users
     *         (username, password, email, role)
     *         VALUES
     *         (?, ?, 'administrador')
     */
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

    if (code) {
        SQL += `, code`;
        args.push(code);
    }

    SQL += `) VALUES (?, ?`;
    if (args.length > 2) SQL += `, ?`;
    if (args.length > 3) SQL += `, ?`;
    SQL += `)`;

    [resultado] = await pool.query(SQL, args);

    return resultado.insertId;
};
export default insertUserModel;
