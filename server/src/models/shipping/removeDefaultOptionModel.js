import { getPool } from '../../db/index.js';

/**
 * Modelo que pone en falso el campo que establece la empresa de transporte por defecto
 * @description - pone el campo defaultSelection en false para todas las entradas de la base de datos
 */
const removeDefaultOptionModel = async () => {
    const pool = await getPool();

    const [res] = await pool.query(
        'UPDATE shipping_company SET modifiedAt = NOW(), defaultSelection = false WHERE defaultSelection = true',
    );
    return res.affectedRows;
};

export default removeDefaultOptionModel;
