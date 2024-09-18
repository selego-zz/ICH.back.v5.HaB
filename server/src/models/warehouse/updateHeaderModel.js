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

    let sql = 'UPDATE invoice_headers SET modifiedAt = NOW()';
    let args = [];

    for (const [key, value] of Object.entries(header)) {
        sql += ', ?? = ?';
        args.push(key);
        args.push(value);
    }
    args.push(headerId);
    await pool.query(sql + ' WHERE id = ?', args);

    header.id = headerId;
};

export default updateHeaderModel;
