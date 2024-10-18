import { generateErrorUtil, sendHtmlMail } from '../utils/index.js';

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
    getLineIdModel,
    //importamos actualizadores
    updateLineModel,
    updateHeaderModel,
    //importamos eliminadores
    deleteAllHeadersModel,
    deleteAllLinesModel,
    deleteHeaderModel,
    deleteHeadersLinesModel,
    deleteLineModel,

    //empresa de transporte
    getShippingMailModel,
    getUserByEmailModel,
    insertUserModel,
} from '../models/index.js';
import getPool from '../db/getPool.js';

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

const updateDBService = async (orders) => {
    const pool = await getPool();

    // pongo todas las fechas de los pedidos en la fecha 0 de la Época ECMAScript
    // lo que siga con esa fecha tras la actualización ya no está en la base de datos, así que hay que borrarlo

    await pool.query('UPDATE invoice_lines SET modifiedAt = "1970/01/01"');
    await pool.query('UPDATE invoice_headers SET modifiedAt = "1970/01/01"');
    await addOrUpdateAllOrdersService(orders);
    await pool.query(
        'DELETE FROM invoice_lines WHERE modifiedAt = "1970/01/01"',
    );
    await pool.query(
        'DELETE FROM invoice_headers WHERE modifiedAt = "1970/01/01"',
    );
};

/**
 * Servicio que recibe un array de pedidos, y lo graba en la base de datos
 * @param {Object[]} orders - Array de Json con toda la información de los pedidos a ingresar, incluye la información del cliente y la del agente
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
 * Servicio que recibe un array de pedidos, y lo graba en la base de datos o actualiza los pedidos que ya estuvieran.
 * @param {Object[]} orders - Array de Json con toda la información de los pedidos a ingresar, incluye la información del cliente y la del agente
 * @description - Llama al servicio `addOrderService` por cada pedido del array suministrado para grabarlo en la base de datos.
 * @returns - Devuelve un Array de enteros con los id de cada cabecera introducida
 */
const addOrUpdateAllOrdersService = async (orders) => {
    let res = [];
    for (const order of orders) {
        res.push(await addOrUpdateOrderService(order));
    }
    return res;
};

/**
 * Servicio que recibe un Json con la información de un pedidos, y lo graba en la base de datos
 * @param {Object} order - Json con toda la información de los pedidos a ingresar, incluye la información del cliente y la del agente
 * @description - Toma la información de la cabecera con el servvicio `getHeaderData`. La graba con el modelo 'addHeaderModel', y luego usa el servicio 'addLineModel' para grabar todas las líneas del pedido
 * @returns - Devuelve el id de la cabecera introducida
 */
const addOrderService = async (order) => {
    await insertOrdersClientAndAgent(order);
    const orderId = await addHeaderModel(getHeaderData(order));
    for (const line of order.lines) {
        await addLineModel(orderId, line);
    }
    return orderId;
};

/**
 * Servicio que recibe un Json con la información de un pedidos, y lo graba en la base de datos o la actualiza si ya estuviera
 * @param {Object} order - Json con toda la información de los pedidos a ingresar, incluye la información del cliente y la del agente
 * @description - Toma la información de la cabecera con el servvicio `getHeaderData`. La graba con el modelo 'addHeaderModel', y luego usa el servicio 'addLineModel' para grabar todas las líneas del pedido
 * @returns - Devuelve el id de la cabecera introducida
 */
const addOrUpdateOrderService = async (order) => {
    await insertOrdersClientAndAgent(order);

    let orderId = await getHeaderIdByNumberModel(
        order.type,
        order.series,
        order.number,
    );
    const header = getHeaderData(order);
    if (!orderId) orderId = await addHeaderModel(header);
    else {
        header.id = orderId;
        await updateHeaderModel(header);
    }

    console.log(`Cabecera: ${order.number} id: ${orderId}`);
    for (const line of order.lines) {
        const lineId = await getLineIdModel(orderId, line.line);
        console.log(
            `orderId: ${orderId} LineId: ${lineId}- Linea: ${line.line} ${line.reference} ${line.name} ${line.description} ${line.format} `,
        );
        if (!lineId) {
            console.log('before addLineModel');
            await addLineModel(orderId, line);
            console.log('after addLineModel');
        } else {
            console.log('before updateLineModel');
            line.id = lineId;

            await updateLineModel(line);
            console.log('after updateLineModel');
        }
        console.log(
            `Finalizada orderId: ${orderId} LineId: ${lineId}- Linea: ${line.line} `,
        );
    }
    return orderId;
};

/**
 * Servicio que recibe un Json con la información de un pedidos,
 * y si no tiene client_id o agent_id, pero tiene los datos de dicho usuario, los inserta en la base de datos, y actualiza los campos en el pedido
 * @param {Object} order - Json con toda la información del pedidos a ingresar, incluye la información del cliente y la del agente
 */
const insertOrdersClientAndAgent = async (order) => {
    if (!order.client_id) {
        const username = order.client_username;
        const password = order.client_password;
        let email = order.client_email;
        const code = order.client_code;
        const role = 'cliente';
        if (!email) email = username;
        const user = await getUserByEmailModel(email);

        if (!user)
            order.client_id = await insertUserModel(
                username,
                password,
                email,
                code,
                role,
            );
        else order.client_id = user.id;

        delete order.client_username;
        delete order.client_password;
        delete order.client_email;
        delete order.client_code;
    }
    if (!order.agent_id) {
        const code = order.agent_code;
        const username = order.agent_username;
        const password = order.agent_password;
        let email = order.agent_email;
        const role = 'comercial';
        if (!email) email = username;

        const user = await getUserByEmailModel(email);
        if (!user)
            order.agent_id = await insertUserModel(
                username,
                password,
                email,
                code,
                role,
            );
        else order.agent_id = user.id;

        delete order.agent_username;
        delete order.agent_password;
        delete order.agent_email;
        delete order.agent_code;
    }
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
            if (!id) generateErrorUtil('Faltan campos', 400);
            orders = await getAllHeadersByClientModel(type, id);
            break;
        case 'comercial':
            if (!id) generateErrorUtil('Faltan campos', 400);
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
 * @param {string} number - Número del pedido a devolver.
 * @param {string} role - Rol de quien realiza la solicitud. Valores posibles: 'administrador', 'empleado', 'cliente', 'comercial'.
 * @param {number} [id] - Id de quien realiza la solicitud, solo necesario en caso de cliente o agente. (Opiconal)
 * @description - Devuelve toda la información del pedido con los tipo serie y número suministrados. En caso de que el rol sea cliente, solo devolverá la información si el pedido pertenece al cliente con el id suministrado. En caso de que el rol sea agente, solo devolverá la información si el pedido pertenece al agente con el id suministrado
 * @returns - Devuelve un Json con la información del pedido que se ajuste a los requisitos
 */
const getOrderByNumberService = async (type, serie, number, role, id) => {
    if (!role) generateErrorUtil('Permisos insuficientes', 400);

    const orderId = await getHeaderIdByNumberModel(type, serie, number);
    if (!orderId) generateErrorUtil('Pedido no encontrado', 404);
    const order = await getHeaderModel(orderId);
    if (!orderId) generateErrorUtil('Error accediendo a los datos', 500);

    if (role === 'cliente' && order.client_id !== id)
        generateErrorUtil('Permisos insuficientes', 400);
    if (role === 'agente' && order.agent_id !== id)
        generateErrorUtil('Permisos insuficientes', 400);

    if (role !== 'administrador' && role !== 'empleado')
        generateErrorUtil('rol incorrecto', 400);

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
    const orderId = await getOrderByNumberService(
        order.type,
        order.serie,
        order.number,
    );
    if (orderId === undefined && order.id === undefined)
        generateErrorUtil('Pedido no encontrado', 404);
    if (order.id && order.id != orderId)
        generateErrorUtil(
            'Tipo, Serie, y Número no coinciden con los suministrados',
            400,
        );
    order.id = orderId; // si existía es igual y no causa daño, sino, se añade
    const header = await getHeaderData(order, false);
    await updateHeaderModel(header);
};

/**
 * Servicio que actualiza el tipo de un pedido dado su tipo, serie y numero
 * @param {string} type - Tipo del pedido cuyo tipo queremos actualizar.
 * @param {string} serie - Serie del pedido cuyo tipo queremos actualizar.
 * @param {string} number - Número del pedido cuyo tipo queremos actualizar.
 * @param {string} newType - Nuevo tipo del pedido cuyo tipo queremos actualizar.
 * @description - Actualiza mediante 'updateHeaderModel' el tipo del pedido al nuevo pedido
 */
const updateHeadersTypeService = async (
    type,
    serie,
    number,
    role,
    userId,
    newType,
) => {
    const [{ id }] = await getOrderByNumberService(
        type,
        serie,
        number,
        role,
        userId,
    );

    if (id === undefined) generateErrorUtil('Pedido no encontrado', 404);
    const header = {
        id,
        type: newType,
    };
    return await updateHeaderModel(header);
};

/**
 * Servicio que actualiza los datos de de un pedido
 * @param {Object} order - Json con los datos del pedido que se quiere modificar.
 * @description - actualiza todos los datos del pedido suministrado. hace uso del servicio  'updateHeaderModel' para actualizar la cabecera, y updateOrInsertLinesService para actualizar las líneas o grabar las nuevas, Si en el pedido original hay líneas que no se suministran en este, no las borra, solo añade o cambia
 */
const updateOrderService = async (order) => {
    const orderId = await getOrderByNumberService(
        order.type,
        order.serie,
        order.number,
    );
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
********************** CABECERA - DELETE ****************************
\*******************************************************************/

/**
 * Servicio que elimna un pedido en base a su tipo, serie y número
 * @param {string} type - Tipo del pedido a eliminar.
 * @param {string} serie - Serie del pedido a eliminar.
 * @param {string} number - Número del pedido a eliminar.
 * @description - Elimna el pedido con los datos indicados, Antes de eliminar la cabecera, hace uso de deleteOrdersLineByIdService para eliminar cada línea del pedido.
 */
const deleteOrderService = async (type, serie, number) => {
    const id = await getHeaderIdByNumberModel(type, serie, number);
    if (!id) generateErrorUtil('Pedido no encontrado', 404);

    await deleteHeadersLinesModel(id);
    await deleteHeaderModel(id);
};

/**
 * Servicio que elimna todos los pedidos de la base de datos
 * @description - Elimna todas las líneas y todas las cabeceras de la base de datos
 */
const deleteAllOrdersService = async () => {
    await deleteAllLinesModel();
    await deleteAllHeadersModel();
};

/*******************************************************************\
********************** CABECERA - DELETE ****************************
\*******************************************************************/

/*******************************************************************\
*********************** LINEAS - POST *******************************
\*******************************************************************/

/**
 * Servicio que añade líneas a un pedido especificado
 * @param {string} type - Tipo del pedido donde insertar las líneas.
 * @param {string} serie - Serie del pedido donde insertar las líneas.
 * @param {string} number - Número del pedido donde insertar las líneas.
 * @param {Object[]} lines - Array de JSON con la informaicón de las líneas a ingresar en la base de datos
 * @description - Añade mediante el modelo 'addLineModel' las líneas a la cabecera indicada por el tipo, serie y número, indicado. Hace uso del modelo 'getHeaderIdByNumberModel' para obtener el id de la cabecera para asociar a ella las líneas
 */
const addLinesService = async (type, serie, number, lines) => {
    const orderId = await getHeaderIdByNumberModel(type, serie, number);
    if (!orderId) generateErrorUtil('Pedido no encontrado', 404);
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
 * @param {string} number - Número del pedido donde insertar la línea.
 * @param {Object} lines - JSON con la informaicón de las líneas a ingresar en la base de datos
 * @description - Añade mediante el serrvicio 'addLineService' la línea a la cabecera con los datos indicado.
 */
const addLineByNumberService = async (type, serie, number, line) => {
    const headerId = await getHeadersLinesModel(type, serie, number);
    if (!headerId) generateErrorUtil('Pedido no encontrado', 404);
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
        const lineId = await getLineIdByNumberService(
            line.type,
            line.serie,
            line.number,
            line.line,
        );
        if (lineId === undefined && line.id === undefined)
            generateErrorUtil('linea no encontrada', 404);
        if (line.id && line.id != lineId)
            generateErrorUtil(
                'Tipo, Serie, y Número no coinciden con los suministrados',
                409,
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
        const lineId = await getLineIdByNumberService(
            line.type, //ESTE ESTÁ BIEN, NO ES COMPLETED
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
            await addLineByNumberService(type, serie, number, line);
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

/**
 * Servicio que actualiza el tipo de una línea dado su tipo, serie y numero
 * @param {string} type - Tipo de la linea cuyo tipo queremos actualizar.
 * @param {string} serie - Serie de la linea cuyo tipo queremos actualizar.
 * @param {string} number - Número de la lineacuyo tipo queremos actualizar.
 * @param {string} completed - Marca si la línea está completa.
 * @description - Actualiza mediante 'updateLineModel' el tipo de la línea al indicado
 */
const updateLineCompletedService = async (
    type,
    serie,
    number,
    lineNumber,
    completed,
) => {
    const id = await getLineIdByNumberService(type, serie, number, lineNumber);
    if (id === undefined) generateErrorUtil('Pedido no encontrado', 404);
    const line = {
        id,
        completed,
    };
    return await updateLineModel(line);
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
 * @param {string} number - Número del pedido cuyo id se busca.
 * @param {number} line - Número de línea de la línea cuyo id se busca.
 * @description - Devuelve el id de la línea con los datos indicados.
 * @return - Devuelve el id de la línea con los datos indicados.
 */
const getLineIdByNumberService = async (type, serie, number, line) => {
    const header_id = await getHeaderIdByNumberModel(type, serie, number);
    if (!header_id) generateErrorUtil('Pedido no encontrado', 404);
    return await getLineIdModel(header_id, line);
};

/*******************************************************************\
*********************** LINEAS - GET ********************************
\*******************************************************************/

/*******************************************************************\
*********************** LINEAS - DELETE *****************************
\*******************************************************************/

/**
 * Servicio que elimna una línea en base a su tipo, serie y número
 * @param {string} type - Tipo del pedido cuya línea vamos a eliminar.
 * @param {string} serie - Serie del pedido cuya línea vamos a eliminar.
 * @param {string} number - Número del pedido cuya línea vamos a eliminar.
 * @param {number} line - Número de línea de la línea que vamos a eliminar.
 * @description - Elimna la línea con los datos indicados.
 */
const deleteOrdersLineByNumerService = async (type, serie, number, line) => {
    const header_id = await getHeaderIdByNumberModel(type, serie, number);
    return await deleteOrdersLineByIdService(header_id, line);
};

/**
 * Servicio que elimna una línea en base al id de su cabecera
 * @param {number} headerId - Id de la cabecera cuya línea vamos a eliminar.
 * @param {number} line - Número de línea de la línea que vamos a eliminar.
 * @description - Elimna la línea con los datos indicados.
 */
const deleteOrdersLineByIdService = async (headerId, line) => {
    await deleteLineModel(await getLineIdModel(headerId, line));
};

/**
 * Servicio que elimna todas las líneas de la base de datos
 * @description - Elimna todas las líneas de la base de datos
 */
const deleteAllLinesService = async () => {
    await deleteAllLinesModel();
};
/*******************************************************************\
*********************** LINEAS - DELETE *****************************
\*******************************************************************/

/*******************************************************************\
*********************** LINEAS - UTILS ******************************
\*******************************************************************/

/**
 * Servicio que envía un correo electrónico a la empresa de transporte con la infomación de recogida
 * @description - Toma la información de los pedidos listos en espera de enviar (type = 'a'), y construye un correo electronico con la informaación de los mismos, que posteriormente envía al transporte
 * @return - Devuelve el id de la línea con los datos indicados.
 */
const sendTransportOrderService = async () => {
    //seleccionamos los pedidos que haya para enviar, si no hay, no se envía mail
    const orders = await getAllOrdersService('a', 'empleado');
    if (orders.length < 1)
        generateErrorUtil(
            'No se han encontrado pedidos listos para enviar',
            404,
        );
    // seleccionar el corrego electrónico de la empresa de transporte principal
    const email = await getShippingMailModel();
    if (!email)
        generateErrorUtil('No se ha encontrado email de transporte', 404);
    const subject = `solicitud de recogida para ${process.env.SHIPPING_INFO_FISCAL_NAME} en fecha ${new Date().toDateString()}`;
    //const body =
    // vamos a construir una tabla, que contendrá las siguientes columnas:
    //// nº Albarán, Nombre Fiscal, Nombre de envío, teléfono, Dirección, Código Postal, Población, Pais, nº de Bultos, Información ADR
    //// la provincia no se suministra, por que es redundante con el código postal, y en los programas de facturación no suele incluirse

    let body = `
<h1>Orden de recogida para ${process.env.SHIPPING_INFO_FISCAL_NAME} en fecha ${new Date().toDateString()}</h1>
<p>Por favor, deseariamos que procedan a la recogida de la mercancía detallada a continuación en nuestros almacenes situados en ${process.env.SHIPPING_INFO_WAREHOSE_DIR}</p>
<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
<tr>
<th>Albarán</th>
<th>Nombre Fiscal</th>
<th>Denominación</th>
<th>Teléfono</th>
<th>Dirección</th>
<th>C. Postal</th>
<th>Población</th>
<th>País</th>
<th>Bultos</th>
<th>ADR</th>
</tr>
`;
    for (const order of orders) {
        body += `
<tr>
    <td>${order.series}/${order.number}</td>
    <td>${order.fiscal_name}</td>
    <td>${order.shipping_name}</td>
    <td>${order.shipping_phone}</td>
    <td>${order.shipping_address}</td>
    <td>${order.shipping_postal_code}</td>
    <td>${order.shipping_city}</td>
    <td>${order.shipping_country}</td>
    <td>${order.packages}</td>
    <td>`;
        for (const line of order.lines) {
            body += line.adr_text ? '<p>' + line.adr_text + '</p>' : '';
        }
        body += `</td>
</tr>
    `;
    }
    body += `</table> <p></p><p>Atentamente, ${process.env.SHIPPING_INFO_FISCAL_NAME} </p>`;
    return await sendHtmlMail(email, subject, body);
};

/*******************************************************************\
*********************** LINEAS - UTILS ******************************
\*******************************************************************/

export {
    //cabecera post
    addAllOrdersService,
    addOrUpdateAllOrdersService,
    addOrderService,
    addOrUpdateOrderService,
    updateDBService,
    //cabecera get
    getOrderService,
    getOrderByNumberService,
    // cabecera put
    updateHeaderService,
    updateOrderService,
    updateHeadersTypeService,
    // cabecera delete
    deleteOrderService,
    deleteAllOrdersService,
    // lines get
    addLinesService,
    addLineService,
    addLineByNumberService,
    getAllOrdersService,
    // lines put
    updateLinesService,
    updateOrInsertLinesService,
    updateLineCompletedService,
    // lines get
    getLineIdByNumberService,

    // lines delete
    deleteOrdersLineByNumerService,
    deleteOrdersLineByIdService,
    deleteAllLinesService,
    //utils
    sendTransportOrderService,
};
