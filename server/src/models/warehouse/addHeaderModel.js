import getPool from '../../db/getPool.js';

/**
 * Modelo para que añadir la cabecera de un pedido a la base de datos
 * @param {Object} header - Datos de la cabecera del pedido
 * @description Insertar los datos de la cabecera suministrada en la base de datos.
 * @returns - Devuelve el Id de la cabecera insertada
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

    for (let [key, value] of Object.entries(header)) {
        SQLInit += key + ', ';
        SQLMiddle += '?, ';
        if (key === 'date' || key === 'delivery_date')
            value = value.slice(0, 10);
        if (key === 'cif') value = value.replace(/[.,-]/g, '');
        args.push(value);
    }
    SQLInit = SQLInit.slice(0, -2);
    SQLMiddle = SQLMiddle.slice(0, -2);

    const [res] = await pool.query(SQLInit + SQLMiddle + SQLEnd, args);
    return res.insertId;
};

export default addHeaderModel;
