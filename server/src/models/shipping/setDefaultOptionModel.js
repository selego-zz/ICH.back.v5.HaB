import { getPool } from '../../db/index.js';

/**
 * Modelo que pone en true el campo que establece la empresa de transporte por defecto para la empresa con el id indicado
 * @param {number} id - Id de la empresa de trasnporte a establecer como principal
 * @description - pone en true el campo que establece la empresa de transporte por defecto para la empresa con el id indicado
 */
const setDefaultOptionModel = async (id) => {
    const pool = await getPool();

    const [res] = await pool.query(
        'UPDATE shipping_company SET modifiedAt = NOW(), defaultSelection = true WHERE id = ?',
        [id],
    );
    return res[0].affectedRows;
};

export default setDefaultOptionModel;
