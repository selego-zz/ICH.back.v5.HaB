import getPool from '../../db/getPool.js';

/**
 * Modelo para que añadir una línea asociada a una cabecera de un pedido en la base de datos
 * @param {number} orderId - Id de la cabecera a la que está asociada la línea que vamos a insertar
 * @param {Object} line - Datos en formato Json de la línea del pedido
 * @description Insertar los datos de la línea suministrada en la base de datos.
 * @returns - Devuelve el Id de la línea insertada
 */
const addLineModel = async (orderId, line) => {
    //ha pasado por Joi, así que sabemos que tiene todos los valores obligatorios como mínimo
    const pool = await getPool();

    //voy a construir una primera cadena, con insert into header (id, number....
    //una segunda cadena que cierra la primera, y mete una interrogación por cada valor de la primera
    //finalment eun array con los valores para suministrar al query
    let SQLInit = 'INSERT INTO invoice_lines (header_id, modifiedAt';
    let SQLMiddle = ') VALUES (?, now()';
    const SQLEnd = ')';
    const keys = [];
    const args = [];
    args.push(orderId);

    for (const [key, value] of Object.entries(line)) {
        SQLInit += ', ??';
        SQLMiddle += ', ?';
        keys.push(key);
        args.push(value);
    }

    const [res] = await pool.query(SQLInit + SQLMiddle + SQLEnd, [
        ...keys,
        ...args,
    ]);
    console.log('Insertada línea');
    console.log(res);

    return res.insertId;
};
export default addLineModel;
