// importamos dotenv, por si acaso
import 'dotenv/config';

/* import {
    prepareAndUpdateDBService,
    setDefaultDBService,
} from './src/services/updateDBService.js';

console.clear();
await setDefaultDBService();
await prepareAndUpdateDBService();
 */
/* import bcrypt from 'bcrypt';
import getPool from './src/db/getPool.js';

const pool = await getPool();
const pass = await bcrypt.hash('123456', 10);
await pool.query(`update users set password = '${pass}' where id = 1`);
 */

import sendHtmlMail from './src/utils/sendHtmlMailUtil.js';
console.log(
    await sendHtmlMail(
        'selego@gmail.com',
        'p1',
        '<h1>hola</h1><p>caracola</p>',
    ),
);

process.exit(0);
