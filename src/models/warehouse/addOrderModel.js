import addHeader from './addHeader.js';
import addLine from './addLine.js';

const getHeaderData = (order) => {
    //construye un json con los datos de la cabecera del pedido

    const res = {};
    for (const [key, value] of Object.entries(order)) {
        if (key !== 'lines') res[key] = value;
    }
    //en este punto res tiene los datos que nos han mandado de la cabecera,
    //pero queremos que si no nos mandan datos de envío se tome los datos fiscales
    // eso lo harémos con lo siguiente=
    res.shipping_name = res.shipping_name || res.fiscal_name;
    res.shipping_address = res.shipping_address || res.address;
    res.shipping_postal_code = res.shipping_postal_code || res.postal_code;
    res.shipping_city = res.shipping_city || res.city;
    res.shipping_country = res.shipping_country || res.country;
    res.shipping_phone = res.shipping_phone || res.phone;

    return res;
};

const addOrderModel = async (order) => {
    const orderId = await addHeader(getHeaderData(order));
    for (const line of order.lines) {
        await addLine(orderId, line);
    }
};

export default addOrderModel;
