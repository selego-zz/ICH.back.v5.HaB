import generateError from '../utils/generateError.js';

import {
    // importamos escritores
    addHeaderModel,
    addLineModel,
    // importamos lectores
    getHeaderModel,
    getHeadersLinesModel,
    getAllHeadersModel,
    getAllHeadersByAgentModel,
    getAllHeadersByClientModel,
    getHeaderIdByNumberModel,
    getLineIdByNumberModel,
    //importamos actualizadores
    updateLineModel,
    updateHeaderModel,
} from '../models/index.js';

/*******************************************************************\
************* FUNCTIONES DE UTILIDAD SOLO PARA ORDERS ***************
\*******************************************************************/
/**
 * Servicio que devuelve solo la información de la cabecera de un Json con un pedido completo
 * @param {Object} order - Json con la información de un pedido completo
 * @param {boolean} [forceShippingInfo] - si es true, si no hay datos de envío, clona los datos fiscales
 * @description - Extrae la información de la cabecera del pedido suministrado, si no tiene información de envío, toma el equivalente de la información fiscal
 * @returns - Devuelve un Json la información de la cabecera del pedido suministrado
 */
const getHeaderData = (order, forceShippingInfo) => {
    //construye un json con los datos de la cabecera del pedido

    const res = {};
    for (const [key, value] of Object.entries(order)) {
        if (key !== 'lines') res[key] = value;
    }
    if (forceShippingInfo) {
        //en este punto res tiene los datos que nos han mandado de la cabecera,
        //pero queremos que si no nos mandan datos de envío se tome los datos fiscales
        // eso lo harémos con lo siguiente:
        res.shipping_name = res.shipping_name || res.fiscal_name;
        res.shipping_address = res.shipping_address || res.address;
        res.shipping_postal_code = res.shipping_postal_code || res.postal_code;
        res.shipping_city = res.shipping_city || res.city;
        res.shipping_country = res.shipping_country || res.country;
        res.shipping_phone = res.shipping_phone || res.phone;
    }

    return res;
};

/*******************************************************************\
************* FUNCTIONES DE UTILIDAD SOLO PARA ORDERS ***************
\*******************************************************************/

/*******************************************************************\
********************** CABECERA - POST ******************************
\*******************************************************************/

/**
 * Servicio que recibe un array de pedidos, y lo graba en la base de datos
 * @param {Object[]} orders - Array de Json con toda la información de los pedidos a ingresar
 * @description - Llama al servicio `addOrderService` por cada pedido del array suministrado para grabarlo en la base de datos.
 * @returns - Devuelve un Array de enteros con los id de cada cabecera introducida
 */
const addAllOrdersService = async (orders) => {
    let res = [];
    orders.forEach(async (order) => {
        res.push(await addOrderService(order));
    });
    return res;
};

/**
 * Servicio que recibe un Json con la información de un pedidos, y lo graba en la base de datos
 * @param {Object} order - Json con toda la información del pedidos a ingresar
 * @description - Toma la información de la cabecera con el servvicio `getHeaderData`. La graba con el modelo 'addHeaderModel', y luego usa el servicio 'addLineModel' para grabar todas las líneas del pedido
 * @returns - Devuelve el id de la cabecera introducida
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
 * Servicio que devuelve todos los pedidos de un tipo determinado
 * @param {string} [type] - Tipo de los pedidos a devolver. (Opcional)
 * @param {string} role - Rol de quien realiza la solicitud. Valores posibles: 'administrador', 'empleado', 'cliente', 'comercial'.
 * @param {number} [id] - Id de quien realiza la solicitud, solo necesario en caso de cliente o agente. (Opiconal)
 * @description - Devuelve toda la información de todos los pedidos. En caso de que se suminsitre Type, restringe la información a los pedidos que se ajusten a ese tipo, en caso de que el rol sea cliente, restringirá los pedidos a los que se ajusten al id del cliente suministrado, en caso de se el rol sea de agente restringirá los pedidos a los que se ajusten al id del agente suministrado
 * @returns - Devuelve un array de Json con la información de los pedidos que se ajuste a los requisitos
 */
const getAllOrdersService = async (type, role, id) => {
    let orders;
    switch (role) {
        case 'administrador':
        case 'empleado':
            orders = await getAllHeadersModel(type);
            break;
        case 'cliente':
            if (!id) generateError('Faltan campos', 400);
            orders = await getAllHeadersByClientModel(type, id);
            break;
        case 'comercial':
            if (!id) generateError('Faltan campos', 400);
            orders = await getAllHeadersByAgentModel(type, id);
            break;
    }

    for (const header of orders) {
        header.lines = await getHeadersLinesModel(header.id);
    }
    return orders;
};

/**
 * Servicio que devuelve el pedidos con el id suministrado
 * @param {number} id - Id del pedido a devolverr
 * @description - Devuelve toda la información del pedido con el id suministrado
 * @returns - Devuelve un Json con la información del pedidos que se ajuste a los requisitos
 */
const getOrderService = async (orderId) => {
    const order = await getHeaderModel(orderId);

    order.lines = await getHeadersLinesModel(orderId);

    return order;
};

/**
 * Servicio que devuelve el pedidos con los tipo, serie y número suministrados
 * @param {string} type - Tipo del pedido a devolver.
 * @param {string} serie - Serie del pedido a devolver.
 * @param {number} number - Número del pedido a devolver.
 * @param {string} role - Rol de quien realiza la solicitud. Valores posibles: 'administrador', 'empleado', 'cliente', 'comercial'.
 * @param {number} [id] - Id de quien realiza la solicitud, solo necesario en caso de cliente o agente. (Opiconal)
 * @description - Devuelve toda la información del pedido con los tipo serie y número suministrados. En caso de que el rol sea cliente, solo devolverá la información si el pedido pertenece al cliente con el id suministrado. En caso de que el rol sea agente, solo devolverá la información si el pedido pertenece al agente con el id suministrado
 * @returns - Devuelve un Json con la información del pedido que se ajuste a los requisitos
 */
const getOrderByNumber = async (type, serie, number, role, id) => {
    if (!role) generateError('Permisos insuficientes', 400);

    const orderId = await getHeaderIdByNumberModel(type, serie, number);
    if (!orderId) generateError('Pedido no encontrado', 404);
    const order = await getHeaderModel(orderId);
    if (!orderId) generateError('Error accediendo a los datos', 500);

    if (role === 'cliente' && order.client_id !== id)
        generateError('Permisos insuficientes', 400);
    if (role === 'agente' && order.agent_id !== id)
        generateError('Permisos insuficientes', 400);

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
 * Servicio que actualiza los datos de una cabecera de un pedido
 * @param {Object} order - Json con los datos del pedido o cabecera cuya cabecera se quiere modificar.
 * @description - se asegura de actualizar solo los datos de cabecera mediante el servicio 'getHeaderData'. Actualiza mediante el modelo 'updateHeaderModel' todos los datos de la cabecera que se suministren
 */
const updateHeaderService = async (order) => {
    const orderId = getOrderByNumber(order.type, order.serie, order.number);
    if (orderId === undefined && order.id === undefined)
        generateError('Pedido no encontrado', 404);
    if (order.id && order.id != orderId)
        generateError(
            'Tipo, Serie, y Número no coinciden con los suministrados',
            400,
        );
    order.id = orderId; // si existía es igual y no causa daño, sino, se añade
    const header = getHeaderData(order, false);
    await updateHeaderModel(header);
};

/**
 * Servicio que actualiza los datos de de un pedido
 * @param {Object} order - Json con los datos del pedido que se quiere modificar.
 * @description - actualiza todos los datos del pedido suministrado. hace uso del servicio  'updateHeaderModel' para actualizar la cabecera, y updateOrInsertLinesService para actualizar las líneas o grabar las nuevas, Si en el pedido original hay líneas que no se suministran en este, no las borra, solo añade o cambia
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

    //    const header = getHeaderData(order);
    await updateHeaderModel(order);
    order.lines.forEach((line) => {
        if (!line.type) line.type = order.type;
        if (!line.serie) line.serie = order.serie;
        if (!line.number) line.number = order.number;
        if (!line.header_id) line.header_id = order.id;
    });
    await updateOrInsertLinesService(order.lines);
};

/*******************************************************************\
********************** CABECERA - PUT *******************************
\*******************************************************************/

/*******************************************************************\
*********************** LINEAS - POST *******************************
\*******************************************************************/

/**
 * Servicio que añade líneas a un pedido especificado
 * @param {string} type - Tipo del pedido donde insertar las líneas.
 * @param {string} serie - Serie del pedido donde insertar las líneas.
 * @param {number} number - Número del pedido donde insertar las líneas.
 * @param {Object[]} lines - Array de JSON con la informaicón de las líneas a ingresar en la base de datos
 * @description - Añade mediante el modelo 'addLineModel' las líneas a la cabecera indicada por el tipo, serie y número, indicado. Hace uso del modelo 'getHeaderIdByNumberModel' para obtener el id de la cabecera para asociar a ella las líneas
 */
const addLinesService = async (type, serie, number, lines) => {
    const orderId = await getHeaderIdByNumberModel(type, serie, number);
    if (!orderId) generateError('Pedido no encontrado', 404);
    for (const line of lines) {
        await addLineModel(orderId, line);
    }
    return orderId;
};

/**
 * Servicio que añade una línea a un pedido especificado
 * @param {number} headerId - id de la cabecera asociada a la línea.
 * @param {Object} lines - JSON con la informaicón de las líneas a ingresar en la base de datos
 * @description - Añade mediante el modelo 'addLineModel' la línea a la cabecera con el id indicado.
 */
const addLineService = async (headerId, line) => {
    await addLineModel(headerId, line);
    return headerId;
};

/**
 * Servicio que añade una línea a un pedido especificado
 * @param {string} type - Tipo del pedido donde insertar la línea.
 * @param {string} serie - Serie del pedido donde insertar la línea.
 * @param {number} number - Número del pedido donde insertar la línea.
 * @param {Object} lines - JSON con la informaicón de las líneas a ingresar en la base de datos
 * @description - Añade mediante el serrvicio 'addLineService' la línea a la cabecera con los datos indicado.
 */
const addLineByNumberService = async (type, serie, number, line) => {
    const headerId = await getHeadersLinesModel(type, serie, number);
    if (!headerId) generateError('Pedido no encontrado', 404);
    await addLineService(headerId, line);
};

/*******************************************************************\
*********************** LINEAS - POST *******************************
\*******************************************************************/

/*******************************************************************\
*********************** LINEAS - PUT *******************************
\*******************************************************************/

/**
 * Servicio que actualiza los datos de un conjunto de líneas de un pedido
 * @param {Object[]} lines - Array de Json con los datos de las lineas que se quiere modificar.
 * @description - Actualiza mediante el modelo 'updateLineModel' todos los datos de las líneas que se suministren. Si la línea no existe no la añade
 */
const updateLinesService = async (lines) => {
    for (const line of lines) {
        const lineId = getLineIdByNumberService(
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

/**
 * Servicio que actualiza los datos de un conjunto de líneas de un pedido
 * @param {Object[]} lines - Array de Json con los datos de las lineas que se quiere modificar.
 * @description - Actualiza mediante el modelo 'updateLineModel' todos los datos de las líneas que se suministren. Si la línea no existe, la añade
 */
const updateOrInsertLinesService = async (lines) => {
    for (const line of lines) {
        const lineId = getLineIdByNumberService(
            line.type,
            line.serie,
            line.number,
            line.line,
        );
        if (line.id === undefined) {
            const type = line.type;
            delete line.type;
            const serie = line.serie;
            delete line.serie;
            const number = line.number;
            delete line.number;
            addLineByNumberService(type, serie, number, line);
        } else {
            if (line.id && line.id != lineId)
                throw new Error(
                    'Tipo, Serie, y Número no coinciden con los suministrados',
                );
            line.id = lineId; // si existía es igual y no causa daño, sino, se añade

            await updateLineModel(line);
        }
    }
};

/*******************************************************************\
*********************** LINEAS - PUT *******************************
\*******************************************************************/

/*******************************************************************\
*********************** LINEAS - GET *******************************
\*******************************************************************/

/**
 * Servicio que devuelve el id de una línea en base a su tipo, serie y número
 * @param {string} type - Tipo del pedido cuyo id se busca.
 * @param {string} serie - Serie del pedido cuyo id se busca.
 * @param {number} number - Número del pedido cuyo id se busca.
 * @param {number} line - Número de línea de la línea cuyo id se busca.
 * @description - Devuelve el id de la línea con los datos indicados.
 * @return - Devuelve el id de la línea con los datos indicados.
 */
const getLineIdByNumberService = async (type, serie, number, line) => {
    const header_id = await getHeaderIdByNumberModel(type, serie, number);
    return await getLineIdByNumberModel(header_id, line);
};

/*******************************************************************\
*********************** LINEAS - GET *******************************
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
    addLineByNumberService,
    getAllOrdersService,
    // lines put
    updateLinesService,
    updateOrInsertLinesService,
    // lines get
    getLineIdByNumberService,
};
