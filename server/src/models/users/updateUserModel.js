import { getPool } from '../../db/index.js';
import bcrypt from 'bcrypt';

/**
 * Modelo para modificar los datos de un usuario en la base de datos
 * @param {number} id - Id del usuario en la base de datos
 * @param {string} [username] - Nombre de usuario. (Opcional).
 * @param {string} [password] - Contraseña del usuario en texto plano. (Opcional).
 * @param {string} [email] - Correo electrónico del usuario. (Opcional).
 * @param {string} [code] - Código de cliente, o código de agente, caso de que el rol sea uno de ellos. (Opcional)
 * @param {string} [role] - El rol del usuario (opcional). Valores posibles: 'administrador', 'empleado', 'cliente', 'comercial'.
 * @param {string} [avatar] - Nombre del archivo con el avatar del usuario en la carpeta uploads. (Opcional).
 * @description - Actualiza en la base de datos la información del usuario con los datos especificados
 */
const updateUserModel = async (
    id,
    username,
    password,
    email,
    code,
    role,
    avatar,
) => {
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

    if (avatar)
        await pool.query('UPDATE users SET avatar = ? where id = ?', [
            avatar,
            id,
        ]);
};

export default updateUserModel;
