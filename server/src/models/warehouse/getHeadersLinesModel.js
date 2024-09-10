import { getPool } from '../../db/index.js';

/**
 * Modelo para solicitar la información de las líneas de un pedido
 * @param {number} headerId - Id de la cabecera cuyas líneas queremos consultar
 * @description - Devuelve las líneas asociadas a la cabecera especificada.
 * @returns - Devuelve un array de json con toda la información de las líneas asociadas a la cabecera especificada.
 */
const getHeadersLinesModel = async (headerId) => {
    const pool = await getPool();
    if (!headerId) return;
    const [res] = await pool.query(
        'SELECT * FROM invoice_lines WHERE header_id = ?',
        headerId,
    );

    return res;
};

export default getHeadersLinesModel;
