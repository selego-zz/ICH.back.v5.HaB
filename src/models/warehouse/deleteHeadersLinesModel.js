import getPool from '../../db/getPool.js';

/**
 * Modelo para que eliminar todas las líneas de una cabecera
 * @param {number} orderId - Id de la cabecera cuyas líneas vamos a eliminar
 * @description - Elímina todas las líneas asociadas a un pedido de la base de datos.
 */
const deleteHeadersLinesModel = async (orderId) => {
    const pool = await getPool();

    await pool.query('delete FROM invoice_lines WHERE header_id = ?', [
        orderId,
    ]);
};
export default deleteHeadersLinesModel;
