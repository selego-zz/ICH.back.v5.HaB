import getPool from '../../db/getPool.js';

/**
 * Insert specified header in the database
 * @param {JSON} header - header's data to insert into the database
 * @returns inserted header id
 */
const addHeaderModel = async (header) => {
    //ha pasado por Joi, así que sabemos que tiene todos los valores obligatorios como mínimo
    const pool = await getPool();

    //voy a construir una primera cadena, con insert into header (id, number....
    //una segunda cadena que cierra la primera, y mete una interrogación por cada valor de la primera
    //finalment eun array con los valores para suministrar al query
    let SQLInit = 'INSERT INTO invoice_headers (';
    let SQLMiddle = ') VALUES (';
    const SQLEnd = ')';
    const args = [];

    for (const [key, value] of Object.entries(header)) {
        SQLInit += key + ', ';
        SQLMiddle += '?, ';
        args.push(value);
    }
    SQLInit = SQLInit.slice(0, -2);
    SQLMiddle = SQLMiddle.slice(0, -2);

    const [res] = await pool.query(SQLInit + SQLMiddle + SQLEnd, args);
    return res.insertId;
};

export default addHeaderModel;
