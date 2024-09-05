import { getPool } from '../../db/index.js';

/**
 * Gets the headers with the specified id
 * @param {number} id - id of the order you want
 * @returns json with the specified header data
 */
const getHeaderModel = async (id) => {
    const pool = await getPool();

    const [res] = await pool.query(
        'SELECT * FROM invoice_headers WHERE id = ?',
        id,
    );

    return res;
};

export default getHeaderModel;
