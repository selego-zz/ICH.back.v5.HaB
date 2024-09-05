import getPool from '../../db/getPool.js';

/**
 * updates a line in the database
 * @param {json} line - line's data to update into the database
 * @returns line's id
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
