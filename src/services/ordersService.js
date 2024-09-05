import generateError from '../utils/generateError.js';

import {
    // importamos escritores
    addHeaderModel,
    addLineModel,
    // importamos lectores
    getOrderIdByNumber,
    getAllHeaders,
    getHeadersLines,
} from '../models/index.js';

/*******************************************************************\
************* FUNCTIONES DE UTILIDAD SOLO PARA ORDERS ***************
\*******************************************************************/
/**
 * extract the header data of a given order, if there is no shpping data, it gets the fiscal data instead
 * @param {JSON} order - json containing a full order
 * @returns JSON with only the headers data
 */
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

/*******************************************************************\
************* FUNCTIONES DE UTILIDAD SOLO PARA ORDERS ***************
\*******************************************************************/

/*******************************************************************\
********************** CABECERA - POST ******************************
\*******************************************************************/

/**
 * gets an array of orders, and calls the models to inser them into the database
 * @param {[JSON]} orders - array with the orders you want to insert into the database
 * @returns an array with all the order's ids
 */
const addAllOrdersService = async (orders) => {
    let res = [];
    orders.forEach(async (order) => {
        res.push(await addOrderService(order));
    });
    return res;
};

/**
 * insert an order into the database
 * @param {JSON} order - the order you want to insert into the database
 * @returns the order's id
 */
const addOrderService = async (order) => {
    const orderId = await addHeaderModel(getHeaderData(order));
    for (const line of order.lines) {
        await addLineModel(orderId, line);
    }
    return orderId;
};
/*******************************************************************\
********************** CABECERA - POST ******************************
\*******************************************************************/

/*******************************************************************\
********************** CABECERA - GET *******************************
\*******************************************************************/

/**
 * Gets all orders with the specified type, if undefined, returns all orders
 * @param {char} type
 * @returns array of json with the specified orders data
 */

const getAllOrdersService = async (type) => {
    const headers = await getAllHeaders(type);

    for (const header of headers) {
        header.lines = await getHeadersLines(type);
    }
};

/*******************************************************************\
********************** CABECERA - GET *******************************
\*******************************************************************/

/*******************************************************************\
*********************** LINEAS - POST *******************************
\*******************************************************************/

/**
 * insert an array of lines into the database
 * @param { char } type - the type of the header associated to this lines
 * @param { string } serie - the serie of the header associated to this lines
 * @param { number } number - the numer of the header associated to this lines
 * @param { [JSON] } lines - array of JSON with the lines you want to insert into the database
 * @returns the order's id
 */
const addLinesService = async (type, serie, number, lines) => {
    const orderId = await getOrderIdByNumber(type, serie, number);
    if (!orderId) generateError('Pedido no encontrado', 404);
    for (const line of lines) {
        await addLineModel(orderId, line);
    }
    return orderId;
};

/**
 * insert a line into the database
 * @param { char } type - the type of the header associated to this lines
 * @param { string } serie - the serie of the header associated to this lines
 * @param { number } number - the numer of the header associated to this lines
 * @param { JSON } line - JSON with the line you want to insert into the database
 * @returns the order's id
 */

const addLineService = async (type, serie, number, line) => {
    const orderId = await getOrderIdByNumber(type, serie, number);
    if (!orderId) generateError('Pedido no encontrado', 404);

    await addLineModel(orderId, line);
    return orderId;
};

/*******************************************************************\
*********************** LINEAS - POST *******************************
\*******************************************************************/

export {
    addOrderService,
    addAllOrdersService,
    addLinesService,
    addLineService,
    getAllOrdersService,
};
