import { getPool } from '../../db/index.js';

/**
 * finds the lines of the specified header
 * @param {number} headerId - the id of the headers whose lines you are seeking
 * @returns the lines belonging to the specified header
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
