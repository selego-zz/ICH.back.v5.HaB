import { getPool } from '../../db/index.js';

/**
 * Modelo para tomar los datos de todas las empresas de transporte.
 * @description - Devuelve los datos de todas las empresas de transporte.
 * @returns - Devuelve un Json con los datos de todas las empresas de transporte.
 */
const getShippingCompaniesModel = async () => {
    const pool = await getPool();

    const [res] = await pool.query('SELECT * FROM shipping_company ');

    return res;
};

export default getShippingCompaniesModel;
