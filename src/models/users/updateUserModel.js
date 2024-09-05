import { getPool } from '../../db/index.js';
import bcrypt from 'bcrypt';

/**
 * updates the data of an user
 * @param {number} id - the id of the user you want to update
 * @param {string} username - username of the user
 * @param {string} password - password in plain text of the user
 * @param {string} email - email of the user
 * @param {string} code - code of the user if aplies
 * @param {string} role - role of the user, default client
 */
const updateUserModel = async (id, username, password, email, code, role) => {
    const pool = await getPool();

    if (username)
        await pool.query('UPDATE users SET username = ? where id = ?', [
            username,
            id,
        ]);
    if (password)
        await pool.query('UPDATE users SET password = ? where id = ?', [
            await bcrypt.hash(password, 10),
            id,
        ]);
    if (email)
        await pool.query('UPDATE users SET email = ? where id = ?', [
            email,
            id,
        ]);
    if (code)
        await pool.query('UPDATE users SET code = ? where id = ?', [code, id]);
    if (role)
        await pool.query('UPDATE users SET role = ? where id = ?', [role, id]);
};

export default updateUserModel;
