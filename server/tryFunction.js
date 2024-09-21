// importamos dotenv, por si acaso
import 'dotenv/config';

import {
    prepareAndUpdateDBService,
    setDefaultDBService,
} from './src/services/updateDBService.js';

console.clear();
await setDefaultDBService();
await prepareAndUpdateDBService();

process.exit(0);
