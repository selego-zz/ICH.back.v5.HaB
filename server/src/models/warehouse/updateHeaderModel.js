import getPool from '../../db/getPool.js';

/**
 * Modelo para que actualiza la cabecera de un pedido en la base de datos
 * @param {Object} header - Json con los datos de la cabecera del pedido
 * @description actualiza los datos de la cabecera suministrada en la base de datos.
 */
const updateHeaderModel = async (header) => {
    const pool = await getPool();

    if (!header.id) return;
    const headerId = header.id;
    delete header.id;

    for (const [key, value] of Object.entries(header)) {
        await pool.query('UPDATE invoice_headers SET ?? = ? WHERE id = ?', [
            key,
            value,
            headerId,
        ]);
    }
    header.id = headerId;
};

export default updateHeaderModel;
