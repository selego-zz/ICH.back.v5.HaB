import getPool from '../../db/getPool.js';

import { SQL_GET_LINE_ID } from './_commonSQL.js';

/**
 * Modelo para que obtener el id de una línea dada una cabecera y su numero de línea
 * @param {number} orderId - Id de la cabecera a la que está asociada la línea cuyo id buscamos
 * @param {number} line - Número de línea de la línea cuyo id buscamos
 * @description - Obtiene el id de una línea de la base de datos dado el id de su cabecera asociada y su múmero de línea .
 * @returns - Devuelve el Id de la línea buscada
 */
const getLineIdModel = async (orderId, line) => {
    const pool = await getPool();

    const [res] = await pool.query(
        SQL_GET_LINE_ID + ' header_id = ? AND line = ?',
        [orderId, line],
    );

    return res.id;
};
export default getLineIdModel;
