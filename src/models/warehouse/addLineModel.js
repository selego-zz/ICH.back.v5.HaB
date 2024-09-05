import getPool from '../../db/getPool.js';

/**
 * Inserts a line in database
 * @param {number} orderId - id of the order this line belongs to
 * @param {json} line - line's data to insert into the database
 * @returns line's id
 */
const addLineModel = async (orderId, line) => {
    //ha pasado por Joi, así que sabemos que tiene todos los valores obligatorios como mínimo
    const pool = await getPool();

    //voy a construir una primera cadena, con insert into header (id, number....
    //una segunda cadena que cierra la primera, y mete una interrogación por cada valor de la primera
    //finalment eun array con los valores para suministrar al query
    let SQLInit = 'INSERT INTO invoice_lines (header_id, ';
    let SQLMiddle = ') VALUES (?, ';
    const SQLEnd = ')';
    const keys = [];
    const args = [];
    args.push(orderId);

    for (const [key, value] of Object.entries(line)) {
        SQLInit += '??, ';
        SQLMiddle += '?, ';
        keys.push(key);
        args.push(value);
    }
    SQLInit = SQLInit.slice(0, -2);
    SQLMiddle = SQLMiddle.slice(0, -2);

    const [res] = await pool.query(SQLInit + SQLMiddle + SQLEnd, [
        ...keys,
        ...args,
    ]);

    return res.insertId;
};
export default addLineModel;
