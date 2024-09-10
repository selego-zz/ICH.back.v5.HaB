import { getPool } from '../../db/index.js';

/**
 * Modelo para solicitar la información de la cabeceras de un pedido
 * @param {number} id - Id de la cabecera a devolver
 * @description - Devuelve las cabeceras del pedido indicado.
 * @returns - Devuelve un json con toda la información de la cabecera del pedidos que cumpla la condicion
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
