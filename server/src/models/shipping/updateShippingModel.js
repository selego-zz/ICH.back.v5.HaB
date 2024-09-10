//importamos las dependencias
import { getPool } from '../../db/index.js';

/**
 * Modelo para actualizar una empresa de transporte en la base de datos
 * @param {numer} id - Id de la empresa de transporte
 * @param {string} username - Nombre de la empresa de transporte
 * @param {string} phone - Teléfono de la empresa de transporte
 * @param {string} email - Correo electrónico de la empresa de transporte
 * @description - Actualiza en la base de datos la información de la empresa de transporte con los datos especificados
 */
const updateShippingModel = async (id, name, phone, email) => {
    // tomamos el pool de la base de datos
    const pool = await getPool();

    const [res] = await pool.query(
        'UPDATE shipping_company SET name = ?, phone = ?, mail = ? WHERE id = ?',
        [name, phone, email, id],
    );
    console.log(res);

    return res.affectedRows; //@@@ esto seguro que está mal, y está en más de un sitio
};
export default updateShippingModel;
