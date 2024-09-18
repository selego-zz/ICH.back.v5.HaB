import { getPool } from '../../db/index.js';
import { SQL_GET_ORDERS_AGENT } from './_commonSQL.js';

/**
 * Modelo para solicitar la información de la cabeceras de un pedido
 * @param {number} id - Id de la cabecera a devolver
 * @description - Devuelve las cabeceras del pedido indicado.
 * @returns - Devuelve un json con toda la información de la cabecera del pedidos que cumpla la condicion
 */
const getOrdersAgentByNumberModel = async (type, series, number) => {
    const pool = await getPool();

    const [res] = await pool.query(
        SQL_GET_ORDERS_AGENT + ' type = ? AND series = ? AND number = ?',
        [type, series, number],
    );

    return res[0].agent_id;
};

export default getOrdersAgentByNumberModel;
