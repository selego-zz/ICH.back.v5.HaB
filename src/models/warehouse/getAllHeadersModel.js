import { getPool } from '../../db/index.js';

/**
 * Modelo para solicitar la información de las cabeceras de los pedidos
 * @param {string} [type] - Tipo de la cabecera. (Opcional). Valores posibles: 'p', 'a', 'f'
 * @description - Devuelve las cabeceras de todos los pedidos. Si se suministra un tipo concreto, la búsqueda estará restringida a los pedidos que se ajusten a ese tipo
 * @returns - Devuelve un array de json con toda la información de las cabeceras de los pedidos que cumplan las condiciones
 */
const getAllHeadersModel = async (type) => {
    const pool = await getPool();

    const [res] = type
        ? await pool.query('SELECT * FROM invoice_headers WHERE type = ?', [
              type,
          ])
        : await pool.query('SELECT * FROM invoice_headers');

    return res;
};

export default getAllHeadersModel;
