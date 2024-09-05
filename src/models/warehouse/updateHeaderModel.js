import getPool from '../../db/getPool.js';

/**
 * updates a header in the database
 * @param {json} header - header's data to insert into the database
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
