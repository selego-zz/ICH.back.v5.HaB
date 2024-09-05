import generateError from '../utils/generateError.js';

import {
    // importamos escritores
    addHeaderModel,
    addLineModel,
    // importamos lectores
    getHeaderModel,
    getHeadersLinesModel,
    getAllHeadersModel,
    getOrderIdByNumberModel,
    //importamos actualizadores
    updateLineModel,
    updateHeaderModel,
    getLineIdByNumberModel,
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
    const orders = await getAllHeadersModel(type);

    for (const header of orders) {
        header.lines = await getHeadersLinesModel(type);
    }
    return orders;
};

/**
 * Gets the orders with the specified id
 * @param {numer} id - id of the order you want
 * @returns json with the sepcified order
 */

const getOrderService = async (orderId) => {
    const order = await getHeaderModel(orderId);

    order.lines = await getHeadersLinesModel(orderId);

    return order;
};

/**
 * Gets the orders with the specified type, series and number
 * @param { char } type - the type of the order you want
 * @param { string } serie - the serie of the order you want
 * @param { number } number - the numer of the order you want
 * @returns json with the sepcified order
 */

const getOrderByNumber = async (type, serie, number) => {
    const orderId = await getOrderIdByNumberModel(type, serie, number);
    const order = await getHeaderModel(orderId);

    order.lines = await getHeadersLinesModel(orderId);

    return order;
};

/*******************************************************************\
********************** CABECERA - GET *******************************
\*******************************************************************/

/*******************************************************************\
********************** CABECERA - PUT *******************************
\*******************************************************************/

/**
 * Updated specified header in the database
 * @param {JSON} header - header to be updated
 */
const updateHeaderService = async (order) => {
    const orderId = getOrderByNumber(order.type, order.serie, order.number);
    if (orderId === undefined && order.id === undefined)
        throw new Error('Pedido no encontrado');
    if (order.id && order.id != orderId)
        throw new Error(
            'Tipo, Serie, y Número no coinciden con los suministrados',
        );
    order.id = orderId; // si existía es igual y no causa daño, sino, se añade
    const header = getHeaderData(order);
    await updateHeaderModel(header);
};

/**
 * Updated specified orders in the database
 * @param {JSON} order - order to be updated
 */
const updateOrderService = async (order) => {
    const orderId = getOrderByNumber(order.type, order.serie, order.number);
    if (orderId === undefined && order.id === undefined)
        throw new Error('Pedido no encontrado');
    if (order.id && order.id != orderId)
        throw new Error(
            'Tipo, Serie, y Número no coinciden con los suministrados',
        );
    order.id = orderId; // si existía es igual y no causa daño, sino, se añade

    const header = getHeaderData(order);
    await updateHeaderModel(header);
    order.lines.forEach((line) => {
        if (!line.type) line.type = order.type;
        if (!line.serie) line.serie = order.serie;
        if (!line.number) line.number = order.number;
        if (!line.header_id) line.header_id = order.id;
    });
    await updateLinesService(order.lines);
};

/*******************************************************************\
********************** CABECERA - PUT *******************************
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
    const orderId = await getHeadersLinesModel(type, serie, number);
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
    const orderId = await getHeadersLinesModel(type, serie, number);
    if (!orderId) generateError('Pedido no encontrado', 404);

    await addLineModel(orderId, line);
    return orderId;
};

/*******************************************************************\
*********************** LINEAS - POST *******************************
\*******************************************************************/

/*******************************************************************\
*********************** LINEAS - PUT *******************************
\*******************************************************************/

/**
 * Updated specifieds lines in the database
 * @param {[JSON]} lines - array of lines to be updated
 */
const updateLinesService = async (lines) => {
    for (const line of lines) {
        const lineId = getLineIdByNumberModel(
            line.type,
            line.serie,
            line.number,
            line.line,
        );
        if (lineId === undefined && line.id === undefined)
            throw new Error('linea no encontrado');
        if (line.id && line.id != lineId)
            throw new Error(
                'Tipo, Serie, y Número no coinciden con los suministrados',
            );
        line.id = lineId; // si existía es igual y no causa daño, sino, se añade

        await updateLineModel(line);
    }
};

/*******************************************************************\
*********************** LINEAS - PUT *******************************
\*******************************************************************/

export {
    //cabecera post
    addOrderService,
    addAllOrdersService,
    //cabecera get
    getOrderService,
    getOrderByNumber,
    // cabecera put
    updateHeaderService,
    updateOrderService,
    // lines get
    addLinesService,
    addLineService,
    getAllOrdersService,
    // lines put
    updateLinesService,
};
