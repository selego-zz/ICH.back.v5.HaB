import getPool from '../../db/getPool.js';

import { SQL_GET_LINE_ID } from './_commonSQL.js';
/**
 * finds a header's id based upon specified arguments
 * @param {number}  header_id - Id de la cabecera asociada a la línea cuyo id se busca.
 * @param {string} number - Número de línea de la línea cuyo id se busca.
 * @description - Busca la id de la línea cuyos datos coincidan con los suministrados
 * @returns - Devuelve la id de la línea cuyos datos coincidan con los suministrados
 */
const getLineIdByNumberModel = async (type, series, number, line) => {
    //ha pasado por Joi, así que sabemos que tiene todos los valores obligatorios como mínimo
    const pool = await getPool();

    const [res] = await pool.query(
        SQL_GET_LINE_ID +
            ' type = ? AND series = ? AND number = ? AND line = ?',
        [type, series, number, line],
    );

    return res[0]?.id;
};
export default getLineIdByNumberModel;
