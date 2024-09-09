import { getPool } from '../../db/index.js';

/**
 * Modelo para tomar el correo electrónico de la empresa de transporte seleccionada como epresa por defecto
 * @description - Devuelve el correo electrónico de la empresa de transporte seleccionada como epresa por defecto
 * @returns - Devuelve un string con  el correo electrónico de la empresa de transporte seleccionada como epresa por defecto
 */
const getShippingMailModel = async () => {
    const pool = await getPool();

    const [res] = await pool.query(
        'SELECT mail FROM shipping_company WHERE defaultSelection = true',
    );

    return res[0].mail;
};

export default getShippingMailModel;
