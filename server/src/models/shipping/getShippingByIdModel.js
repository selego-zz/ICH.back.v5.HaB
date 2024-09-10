import { getPool } from '../../db/index.js';

/**
 * Modelo para tomar los datos de la empresa de transporte.
 * @param {number} id - Id de la empresa de transporte cuyos datos buscamos.
 * @description - Devuelve los datos de la empresa de transporte.
 * @returns - Devuelve un Json con los datos de la empresa de transporte cuyo id hemos introducido.
 */
const getShippingByIdModel = async (id) => {
    const pool = await getPool();

    const [res] = await pool.query(
        'SELECT * FROM shipping_company WHERE id = ?',
        [id],
    );

    return res[0];
};

export default getShippingByIdModel;
