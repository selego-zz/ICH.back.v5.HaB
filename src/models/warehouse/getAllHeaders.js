import { getPool } from '../../db/index.js';

/**
 * Gets all headers with the specified type, if undefined, returns all headers
 * @param {char} type
 * @returns array of json with the specified headers data
 */
const getAllHeaders = async (type) => {
    const pool = await getPool();

    const [res] = type
        ? await pool.query('SELECT * FROM invoice_headers WHERE type = ?', type)
        : await pool.query('SELECT * FROM invoice_headers');

    return res;
};

export default getAllHeaders;
