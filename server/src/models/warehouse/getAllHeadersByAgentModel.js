import { getPool } from '../../db/index.js';

import { SQL_GET_ALL_HEADERS } from './_commonSQL.js';

/**
 * Modelo para solicitar la información de las cabeceras de los pedidos
 * @param {string} [type] - Tipo de la cabecera. (Opcional). Valores posibles: 'p', 'a', 'f'
 * @param {number} agent_id - Id del agente.
 * @description - Devuelve las cabeceras de todos los pedidos del agente especificado. Si se suministra un tipo concreto, la búsqueda estará restringida a los pedidos que se ajusten a ese tipo
 * @returns - Devuelve un array de json con toda la información de las cabeceras de los pedidos que cumplan las condiciones
 */
const getAllHeadersByAgentModel = async (type, agent_id) => {
    const pool = await getPool();

    const [res] = type
        ? await pool.query(
              SQL_GET_ALL_HEADERS + ' and type = ? and agent_id = ?',
              [type, agent_id],
          )
        : await pool.query(SQL_GET_ALL_HEADERS + ' and agent_id = ?', [
              agent_id,
          ]);

    return res;
};

export default getAllHeadersByAgentModel;
