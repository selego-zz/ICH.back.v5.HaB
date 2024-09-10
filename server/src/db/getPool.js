//dependencias
import mysql from 'mysql2/promise';

//Variables de entorno para la conexión con la base de datos
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB } = process.env;

//variable en la que almacenamos la Base de Datos
let pool;

/**
 * Función que retorna el pool de la conexión a la base de datos
 * @description Crea una conexión con la base de datos. Encaso de que la base de datos especificada no exista, la crea.
 * @env {string} MYSQL_HOST - Host que alberga el servidor de la base de datos.
 * @env {string} MYSQL_USER - Nombre usuario de la conexión a la base de datos.
 * @env {string} MYSQL_PASSWORD - Password del usuario de la conexión a la base de datos.
 * @env {string} MYSQL_DB - Nombre de la base de datos.
 */
const getPool = async () => {
    try {
        //Si no existe la conexión, la creamos
        if (!pool) {
            pool = mysql.createPool({
                host: MYSQL_HOST,
                user: MYSQL_USER,
                password: MYSQL_PASSWORD,
                timezone: 'Z',
            });

            //creamos la base de datos
            await pool.query(`CREATE DATABASE IF NOT EXISTS ${MYSQL_DB}`);

            //Seleccionamos la base de datos creada
            pool = mysql.createPool({
                host: MYSQL_HOST,
                user: MYSQL_USER,
                password: MYSQL_PASSWORD,
                database: MYSQL_DB,
                timezone: 'Z',
            });
        }

        return pool;
    } catch (err) {
        console.error(err);
    }
};

export default getPool;
