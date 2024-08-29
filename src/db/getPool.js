//dependencias
import mysql from 'mysql2/promise';

//Variables de entorno para la conexión con la base de datos
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB } = process.env;

//variable en la que almacenamos la Base de Datos
let pool;

//Función que retorna la conexión
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
            await pool.query(`USE ${MYSQL_DB}`);
        }

        return pool;
    } catch (err) {
        console.error(err);
    }
};

export default getPool;
