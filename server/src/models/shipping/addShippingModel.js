//importamos las dependencias
import { getPool } from '../../db/index.js';

/**
 * Modelo para insertar una empresa de transporte en la base de datos
 * @param {string} username - Nombre de la empresa de transporte
 * @param {string} phone - Teléfono de la empresa de transporte
 * @param {string} email - Correo electrónico de la empresa de transporte
 * @param {boolean} [defaultSelection] - Establece si es la emrpesa de transporte por defecto. (Opcional). Valor por defecto: false
 * @description - Inserta en la base de datos la información de la empresa de transporte con los datos especificados
 */
const addShippingModel = async (name, phone, email, defaultSelection) => {
    // tomamos el pool de la base de datos
    const pool = await getPool();

    //puede parecer redundante, pero si es null o undefined, puede dejar datos que no queremos en la base de datos
    if (!defaultSelection) defaultSelection = false;

    const [res] = await pool.query(
        'INSERT INTO shipping_company (name, phone, mail, defaultSelection) VALUES (?,?,?,?)',
        [name, phone, email, defaultSelection],
    );

    return res.insertId;
};
export default addShippingModel;
