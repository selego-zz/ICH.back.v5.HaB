import { getPool } from '../../db/index.js';

/**
 * Modelo para eliminar los datos de la empresa de transporte.
 * @param {number} id - Id de la empresa de transporte cuyos datos queremos eliminar.
 * @description - Elimina los datos de la empresa de transporte.
 */
const deleteShippingByIdModel = async (id) => {
    const pool = await getPool();

    const [res] = await pool.query(
        'DELETE FROM shipping_company WHERE id = ?',
        [id],
    );

    return res.affectedRows;
};

export default deleteShippingByIdModel;
