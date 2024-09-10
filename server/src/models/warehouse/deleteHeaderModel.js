import getPool from '../../db/getPool.js';

/**
 * Modelo para que eliminar una cabecera dado su id
 * @param {number} id - Id de la cabecera que vamos a eliminar
 * @description - Elímina una cabecera de la base de datos.
 */
const deleteHeaderModel = async (id) => {
    const pool = await getPool();

    await pool.query('DELETE FROM invoice_headers WHERE ID = ?', [id]);
};
export default deleteHeaderModel;
