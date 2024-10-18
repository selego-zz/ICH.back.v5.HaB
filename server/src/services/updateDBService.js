/**
 * este archivo se dedica a la importación de la base de datos, es un caso muy específico, sujeto a un programa concreto.
 * Se recomienda usar las buncoines de API deleteAllOrdersController, y addAllOrdersController
 * - subida al servidor desde su disco local,
 * - envío desde el front end,
 * - toma de datos desde la base de datos de facturación y contabilidad
 */

//importamos la conexion a la base de datos
import ADODB from 'node-adodb';
import path from 'path';

import {
    uploadFileUtil,
    removeFileUtil,
    generateErrorUtil,
} from '../utils/index.js';
import { updateDBService } from './index.js';

let pool;
let dbName;
const getAccessPool = () => {
    try {
        if (!dbName)
            generateErrorUtil(
                'No se ha suministrado ruta a la base de datos',
                404,
            );
        const connStr = `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${dbName};Persist Security Info=False;`;
        if (!pool) pool = ADODB.open(connStr, true);

        return pool;
    } catch (err) {
        console.error(err);

        generateErrorUtil(err);
    }
};

const setDefaultDBService = async () => {
    const serverDBName = process.env.SERVER_DB_NAME;
    const uploadsPath = path.join(process.cwd(), process.env.UPLOADS_DIR);
    dbName = path.join(uploadsPath, serverDBName);

    //console.log(`BD establecida como ${dbName}`);
};

const uploadDBService = async (dbFile) => {
    const dbPath = process.env.PC_DB_PATH;
    const serverDBName = process.env.SERVER_DB_NAME;
    const uploadsPath = path.join(process.cwd(), process.env.UPLOADS_DIR);
    const dbName = path.join(uploadsPath, serverDBName);

    //console.log('adquiriendo db');

    if (!dbFile) {
        //copiamos la base de datos para actualizar los datos de la base de datos
        await uploadFileUtil(dbPath, serverDBName);
    } else {
        //guarfamos el archivo en la carpeta uploads
        await dbFile.mv(dbName);
    }
};
const removeDBService = async () => {
    try {
        //ya acabamos, así que borramos la base de datos para no ocupar espacio
        await removeFileUtil(dbName);
    } catch (err) {
        console.error(err);
        generateErrorUtil(err);
    }
};

const findBaseProductService = async (product) => {
    if (!product) return;
    const localPool = await getAccessPool();

    const sql = `SELECT Componente FROM escandallos WHERE articulo = '${product}'`;
    const res = await localPool.query(sql);

    if (!res || res?.length === 0) return;
    if (res.length > 1) return product;

    const base = await findBaseProductService(res[0].Componente);

    return base ? base : product;
};

const prepareAndUpdateDBService = async () => {
    try {
        const localPool = await getAccessPool();

        /*         let sql = `SELECT l.contador,
                    c.tipo as type, 
                    c.serie as series, 
                    c.Numero as [number], 
                    FALSE as revised, 
                    [su numero] as client_number, 
                    fecha as [date], 
                    [Fecha Entrega] as delivery_date, 
                    c.cif, 
                    c.[nombre fiscal] as fiscal_name, 
                    c.domicilio as address, 
                    c.[c postal] as postal_code, 
                    c.poblacion as city, 
                    c.pais as country, 
                    [Nombre envio] as shipping_name, 
                    [Domicilio envio] as shipping_address, 
                    [C postal envio] as shipping_postal_code, 
                    [Poblacion envio] as shipping_city, 
                    [pais envio] as shipping_country, 
                    c.bultos as packages, 
                    observaciones as observations, 
                    Linea as line, 
                    false as completed, 
                    "" as reference, 
                    Producto as name, 
                    Descripcion as description, 
                    l.libre1 as format, 
                    [Uds Pedidas] as ordered_units, 
                    [Uds Servidas] as served_units, 
                    l.libre5 as adr_text, 
                    df.telefono1 as phone, 
                    clientes.[Pagina Web] as mail, 
                    [Cliente Proveedor] as client_code, 
                    clientes.[nombre Fiscal] as client_username,
                    clientes.CIF as client_password,
                    clientes.[Pagina Web] as client_email,
                    [C Agente] as agent_code, 
                    agentes.nombre as agent_username,
                    agentes.CIF as agent_password,
                    agentes.EMail as agent_email
                FROM [cabecera Facturacion] c, 
                    [lineas Facturacion] l, 
                    clientes, 
                    agentes, 
                    direcciones df
                WHERE c.tipo = l.tipo 
                    AND c.serie = l.serie 
                    AND c.numero = l.numero 
                    AND c.[Cliente Proveedor] = clientes.codigo
                    AND c.[c agente] = agentes.codigo
                    AND (c.domicilio = df.domicilio OR c.domicilio IS NULL)
                    AND (c.[c postal] = df.[c postal] OR c.[c postal] IS NULL)
                    AND (c.poblacion = df.poblacion OR c.poblacion IS NULL)
                    AND (c.pais = df.pais OR c.pais IS NULL)
                    AND c.tipo = "P" 
                    AND c.serie <> "CRS" 
                    AND l.[Uds Pedidas] > 0 
                    AND l.[Uds Servidas] < l.[Uds Pedidas] 
                    AND l.almacen = "01"
                ORDER BY c.tipo, c.serie, c.numero, l.linea;
                `;
 */

        let sql_header = `SELECT DISTINCT 
                    c.tipo as type, 
                    c.serie as series, 
                    c.Numero as [number], 
                    [su numero] as client_number, 
                    fecha as [date], 
                    [Fecha Entrega] as delivery_date, 
                    c.cif, 
                    c.[nombre fiscal] as fiscal_name, 
                    c.domicilio as address, 
                    c.[c postal] as postal_code, 
                    c.poblacion as city, 
                    c.pais as country, 
                    df.telefono1 as phone, 
                    clientes.[Pagina Web] as mail, 
                    [Nombre envio] as shipping_name, 
                    [Domicilio envio] as shipping_address, 
                    [C postal envio] as shipping_postal_code, 
                    [Poblacion envio] as shipping_city, 
                    [pais envio] as shipping_country, 
                    c.bultos as packages, 
                    observaciones as observations, 
                    [Cliente Proveedor] as client_code, 
                    clientes.[nombre Fiscal] as client_username,
                    clientes.CIF as client_password,
                    clientes.[Pagina Web] as client_email,
                    [C Agente] as agent_code, 
                    agentes.nombre as agent_username,
                    agentes.CIF as agent_password,
                    agentes.EMail as agent_email
                FROM [cabecera Facturacion] c, 
                    [lineas Facturacion] l,  
                    clientes,
                    agentes, 
                    direcciones df
                WHERE c.tipo = l.tipo 
                    AND c.serie = l.serie 
                    AND c.numero = l.numero 
                    AND c.[Cliente Proveedor] = clientes.codigo
                    AND c.[c agente] = agentes.codigo
                    AND (c.domicilio = df.domicilio OR c.domicilio IS NULL)
                    AND (c.[c postal] = df.[c postal] OR c.[c postal] IS NULL)
                    AND (c.poblacion = df.poblacion OR c.poblacion IS NULL)
                    AND (c.pais = df.pais OR c.pais IS NULL)
                    AND c.tipo = "P" 
                    AND c.serie <> "CRS" 
                    AND l.[Uds Pedidas] > 0 
                    AND l.[Uds Servidas] < l.[Uds Pedidas] 
                    AND l.almacen = "01"
                ORDER BY c.numero;
                `;

        // aquí tenemos 2 problemas:
        //// Por como gestiona el programa las direcciones, la dirección de envío puede ser nula.
        //// Por como gestiona access los campos nulos y los join, en caso de que la dirección de envío sea nula,
        //// crea duplicados en la consulta, por lo que él teléfono de la dirección de envío habrá que pedirlo a parte.
        // A mayores, los productos pueden estar compuestos de una serie de productos, en cuyo caso se considera como producto base ese
        // pero pueden estar compuestos de un solo producto, en cuyo caso el producto base es el compuesto
        const localOrders = await localPool.query(sql_header);

        for (const order of localOrders) {
            //console.log(`${order.number} - ${order.fiscal_name}`);
            if (!order.mail) order.mail = order.fiscal_name;
            if (!order.shipping_address || order.shipping_address.length < 1) {
                //console.log('no había dirección de envío');
                // si no tenemos datos de envío, copiamos los de facturación
                order.shipping_phone = order.phone;
                order.shipping_address = order.address;
                order.shipping_postal_code = order.postal_code;
                order.shipping_city = order.city;
                order.shipping_country = order.country;
            } else {
                //console.log('si había dirección de envío');
                let sql = `SELECT telefono1 as shipping_phone 
                           FROM direcciones
                           WHERE
                                domicilio = '${order.shipping_address}'
                            AND [C postal] = '${order.shipping_postal_code}'
                            AND poblacion = '${order.shipping_city}'
                            AND pais = '${order.shipping_country}'`;

                const [res] = await localPool.query(sql);
                order.shipping_phone = res.shipping_phone;
            }

            // en estos momentos tenemos la cabecera completa. hay que añadirle el campo lineas
            // seleccionamos todas las líneas

            let sql = `SELECT 
                    Linea as line, 
                    false as completed, 
                    "" as reference, 
                    Producto as name, 
                    Descripcion as description, 
                    l.libre1 as format, 
                    [Uds Pedidas] as ordered_units, 
                    [Uds Servidas] as served_units, 
                    l.libre5 as adr_text 
                FROM [lineas Facturacion] l 
                WHERE tipo = '${order.type}'
                    AND serie = '${order.series}' 
                    AND numero = ${order.number} 
                `;
            const lines = await localPool.query(sql);

            for (const line of lines) {
                //console.log(`${order.number} - ${line.line} - ${line.name}`);

                // tomamos el valor de referencia de cada producto
                const base = await findBaseProductService(line.name);
                //console.log('Encontrado producto base:', base);

                line.reference = base ? base : line.name;
            }
            //console.log('antes de meter lineas en pedidos');
            // añadimos las líneas al pedido
            order.lines = lines;
        }

        await updateDBService(localOrders);
    } catch (err) {
        console.error(err);

        generateErrorUtil(err);
    }
};

export {
    getAccessPool,
    setDefaultDBService,
    uploadDBService,
    removeDBService,
    prepareAndUpdateDBService,
};
