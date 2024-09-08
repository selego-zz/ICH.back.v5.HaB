import getPool from '../../db/getPool.js';

/**
 * Modelo para que actualiza una línea de un pedido en la base de datos
 * @param {Object} line - Json con los datos de la línea a acctualizar
 * @description actualiza los datos de la linea suministrada en la base de datos.
 */
const updateLineModel = async (line) => {
    const pool = await getPool();

    if (!line.id) return;
    const lineId = line.id;
    delete line.id;

    for (const [key, value] of Object.entries(line)) {
        await pool.query('UPDATE invoice_lines SET ?? = ? WHERE id = ?', [
            key,
            value,
            lineId,
        ]);
    }
    line.id = lineId;
};

export default updateLineModel;
