import { getPool } from '../../db/index.js';
import { SQL_GET_ORDERS_CLIENT } from './_commonSQL.js';

/**
 * Modelo para solicitar la información de la cabeceras de un pedido
 * @param {number} id - Id de la cabecera a devolver
 * @description - Devuelve las cabeceras del pedido indicado.
 * @returns - Devuelve un json con toda la información de la cabecera del pedidos que cumpla la condicion
 */
const getOrdersClientModel = async (id) => {
    const pool = await getPool();

    const [res] = await pool.query(SQL_GET_ORDERS_CLIENT + ' id = ?', [id]);

    return res[0].client_id;
};

export default getOrdersClientModel;
