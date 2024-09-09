// importamos dotenv, por si acaso
import 'dotenv/config';
import updateShippingModel from './src/models/shipping/updateShippingModel.js';

// importamos la función que queremos testear
///import { sendTransportOrderService } from './src/services/index.js';
//import sendMail from './src/utils/sendMailUtil.js';

//console.log(await sendTransportOrderService());
//console.log(await sendMail('selego@gmail.com', 'hoola', 'hola'));

console.log(
    await updateShippingModel(1, 'TXT', '923923923', 'selego@gmail.com'),
);

process.exit(0);
