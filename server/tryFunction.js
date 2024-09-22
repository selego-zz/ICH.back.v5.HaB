// importamos dotenv, por si acaso
import 'dotenv/config';

import {
    prepareAndUpdateDBService,
    setDefaultDBService,
} from './src/services/updateDBService.js';

console.clear();
await setDefaultDBService();
await prepareAndUpdateDBService();

/* import bcrypt from 'bcrypt';
import getPool from './src/db/getPool.js';

const pool = await getPool();
const pass = await bcrypt.hash('123456', 10);
await pool.query(`update users set password = '${pass}' where id = 1`);
 */

process.exit(0);
