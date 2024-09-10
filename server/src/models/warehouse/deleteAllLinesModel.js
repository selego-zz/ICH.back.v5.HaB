import getPool from '../../db/getPool.js';

/**
 * Modelo para que eliminar todas las líneas de la base de datos
 * @description - Elímina todas las líneas de la base de datos.
 */
const deleteAllLinesModel = async () => {
    const pool = await getPool();

    await pool.query('DELETE FROM invoice_lines WHERE ID > -1');
};
export default deleteAllLinesModel;
