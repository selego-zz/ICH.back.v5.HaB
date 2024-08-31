import 'dotenv/config';

import getPool from './getPool.js';
import insertUserModel from '../models/index.js';

const DROP_TABLES =
    'DROP TABLE IF EXISTS invoice_lines, invoice_headers, users';

const USER_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS users(
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(30) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        role ENUM ('administrador', 'empleado', 'cliente', 'comercial') DEFAULT 'cliente',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        modifiedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`;
const INVOICE_HEADERS_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS invoice_headers(
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        type ENUM ('p', 'a', 'f') DEFAULT 'p',
        series CHAR(3) NOT NULL,
        number CHAR(7) NOT NULL,
        CONSTRAINT UC_type_series_number UNIQUE (type, series, number),
        client_number  VARCHAR(7),
        date DATE DEFAULT (CURRENT_DATE),
        delivery_date DATE DEFAULT (CURRENT_DATE),
        agent_id INT UNSIGNED   NOT NULL,
        FOREIGN KEY(agent_id) REFERENCES users(id),
        client_id INT UNSIGNED  NOT NULL,
        FOREIGN KEY(client_id) REFERENCES users(id),
        cif VARCHAR(10) NOT NULL,
        fiscal_name VARCHAR(50) NOT NULL,
        address VARCHAR(100) NOT NULL,
        postal_code CHAR(5) NOT NULL,
        city VARCHAR(50) NOT NULL,
        country VARCHAR(50) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        mail VARCHAR(50) NOT NULL,
        shipping_name VARCHAR(10) NOT NULL,
        shipping_address VARCHAR(100) NOT NULL,
        shipping_postal_code CHAR(5) NOT NULL,
        shipping_city VARCHAR(50) NOT NULL,
        shipping_country VARCHAR(50) NOT NULL,
        shipping_phone VARCHAR(15) NOT NULL,
        packages TINYINT UNSIGNED DEFAULT 1,
        observations TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        modifiedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
        `;
const INVOICE_LINES_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS invoice_lines(
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        header_id INT UNSIGNED NOT NULL,
        FOREIGN KEY (header_id) REFERENCES invoice_headers(id),
        line TINYINT UNSIGNED NOT NULL,
        CONSTRAINT UC_header_id_line UNIQUE (header_id, line),
        type ENUM ('p', 'a', 'f') DEFAULT 'p',
        reference VARCHAR(15) NOT NULL,
        name VARCHAR(30) NOT NULL,
        description VARCHAR(30) NOT NULL,
        format VARCHAR(20) NOT NULL,
        ordered_units DECIMAL(7, 2) NOT NULL,
        served_units DECIMAL(7, 2),
        adr_text TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        modifiedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
        `;

const main = async () => {
    try {
        const pool = await getPool();

        console.log('Inicio de creación de tablas');

        // primero borramos las tablas
        console.log('\nBorrando tablas...');
        await pool.query(DROP_TABLES);
        console.log('Tablas borradas');

        // Luego creamos las tablas
        console.log('Creando tablas...');
        console.log('Creando tabla de usuarios...');
        await pool.query(USER_TABLE_SQL);
        console.log('Creando tabla de cabecera de facturacion...');
        await pool.query(INVOICE_HEADERS_TABLE_SQL);
        console.log('Creando tabla de líneas de facturación...');
        await pool.query(INVOICE_LINES_TABLE_SQL);
        console.log('Tablas creadas');

        //creamos el primer usuario administrador
        console.log('Creando administrador...');
        await insertUserModel(
            process.env.ADMIN_USER_USERNAME,
            process.env.ADMIN_USER_PASSWORD,
            process.env.ADMIN_USER_PASSWORD,
            'administrador',
        );
        console.log('Administrador creado');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

main();
