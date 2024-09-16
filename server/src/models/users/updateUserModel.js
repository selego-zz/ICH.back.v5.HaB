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

    let sql = 'UPDATE users SET updatedAt = NOW()';
    let args = [];
    if (username) {
        sql += ', username = ?';
        args.push(username);
    }
    if (password) {
        if (args.length > 0) sql;
        sql += ', password = ?';
        args.push(await bcrypt.hash(password, 10));
    }
    if (email) {
        if (args.length > 0) sql;
        sql += ', email = ?';
        args.push(email);
    }
    if (code) {
        if (args.length > 0) sql;
        sql += ', code = ?';
        args.push(code);
    }
    if (role) {
        if (args.length > 0) sql;
        sql += ', role = ?';
        args.push(role);
    }
    if (avatar) {
        if (args.length > 0) sql;
        sql += ', avatar = ?';
        args.push(avatar);
    }

    args.push(id);
    await pool.query(sql + ' where id = ?', args);
};

export default updateUserModel;
