// importamos dotenv, por si acaso
import 'dotenv/config';

// importamos la función que queremos testear
import { sendTransportOrderService } from './src/services/index.js';
//import sendMail from './src/utils/sendMailUtil.js';

console.log(await sendTransportOrderService());
//console.log(await sendMail('selego@gmail.com', 'hoola', 'hola'));
process.exit(0);
