import { getPool } from '../db/index.js';
import bcrypt from 'bcrypt';

const updateUserModel = async (id, username, password, email, role) => {
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
    if (role)
        await pool.query('UPDATE users SET role = ? where id = ?', [role, id]);
};

export default updateUserModel;
