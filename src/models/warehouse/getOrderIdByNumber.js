import getPool from '../../db/getPool.js';

/**
 * finds a header's id based upon specified arguments
 * @param { char}  type - header's type
 * @param { string } serie - header's serie
 * @param { number } number - header's number
 * @returns header's id if found, undefined otherwise
 */
const getOrderIdByNumber = async (type, serie, number) => {
    //ha pasado por Joi, así que sabemos que tiene todos los valores obligatorios como mínimo
    const pool = await getPool();

    const [res] = await pool.query(
        'SELECT id FROM invoice_headers WHERE type = ? AND series = ? and number = ?',
        [type, serie, number],
    );

    return res[0]?.id;
};
export default getOrderIdByNumber;
