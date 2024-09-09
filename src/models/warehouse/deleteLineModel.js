import getPool from '../../db/getPool.js';

/**
 * Modelo para que eliminar una línea dado su id
 * @param {number} id - Id de la línea que vamos a eliminar
 * @description - Elímina una línea de la base de datos.
 */
const deleteLineModel = async (id) => {
    const pool = await getPool();

    await pool.query('DELETE FROM invoice_lines WHERE ID = ?', [id]);
};
export default deleteLineModel;
