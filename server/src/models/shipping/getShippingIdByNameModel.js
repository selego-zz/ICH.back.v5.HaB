import { getPool } from '../../db/index.js';

/**
 * Modelo para tomar los datos de la empresa de transporte.
 * @param {string} name - Nombre de la empresa de transporte cuyos datos buscamos.
 * @description - Devuelve los datos de la empresa de transporte.
 * @returns - Devuelve un Json con los datos de la empresa de transporte cuyo nombre hemos introducido.
 */
const getShippingIdByNameModel = async (name) => {
    const pool = await getPool();

    const [res] = await pool.query(
        'SELECT * FROM shipping_company WHERE name = ?',
        [name],
    );

    return res[0].id;
};

export default getShippingIdByNameModel;
