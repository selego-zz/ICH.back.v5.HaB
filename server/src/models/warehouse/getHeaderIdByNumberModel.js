import getPool from '../../db/getPool.js';

/**
 * Modelo para buscar la id de una cabecera en base a su tipo, serie y número
 * @param {string} type - Tipo de la cabecera cuyo id buscamos. Valores posibles: 'p', 'a', 'f'
 * @param {string} series - Serie de la cabecera cuyo id buscamos
 * @param {string} number - Número de la cabecera cuyo id buscamos
 * @description - Busca la id de la cabeceras cuyos datos coincidan con los suministrados
 * @returns - Devuelve la id de la cabeceras cuyos datos coincidan con los suministrados
 */
const getHeaderIdByNumberModel = async (type, series, number) => {
    //ha pasado por Joi, así que sabemos que tiene todos los valores obligatorios como mínimo
    const pool = await getPool();

    const [res] = await pool.query(
        'SELECT id FROM invoice_headers WHERE type = ? AND series = ? AND number = ?',
        [type, series, number],
    );

    return res[0]?.id;
};
export default getHeaderIdByNumberModel;
