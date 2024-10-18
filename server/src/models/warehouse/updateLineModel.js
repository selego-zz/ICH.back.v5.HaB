import getPool from '../../db/getPool.js';

/**
 * Modelo para que actualiza una línea de un pedido en la base de datos
 * @param {Object} line - Json con los datos de la línea a acctualizar
 * @description actualiza los datos de la linea suministrada en la base de datos.
 */
const updateLineModel = async (line) => {
    const pool = await getPool();

    if (!line.id) return;
    const lineId = line.id;
    delete line.id;

    let sql = 'UPDATE invoice_lines SET modifiedAt = NOW()';
    let args = [];
    console.log(sql);
    console.log(args);

    for (const [key, value] of Object.entries(line)) {
        sql += ', ?? = ?';
        args.push(key);
        args.push(value);
        console.log(sql);
        console.log(args);
    }
    args.push(lineId);
    console.log(sql + ' WHERE id = ?');
    console.log(args);
    const [res] = await pool.query(sql + ' WHERE id = ?', args);
    console.log('actualizada línea');
    console.log(res);

    line.id = lineId;
    return res.affectedRows;
};

export default updateLineModel;
