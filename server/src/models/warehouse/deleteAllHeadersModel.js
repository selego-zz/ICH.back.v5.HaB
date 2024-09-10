import getPool from '../../db/getPool.js';

/**
 * Modelo para que eliminar todas las cabeceras de la base de datos
 * @description - Elímina todas las cabeceras de la base de datos.
 */
const deleteAllHeadersModel = async () => {
    const pool = await getPool();

    await pool.query('DELETE FROM invoice_headers WHERE ID >-1');
};
export default deleteAllHeadersModel;
