# ICH.back.v5.HaB

Se trata de una API de destinada a gestión de pedidos para la parte
de un almacén de una empresa, su utilidad es que los empleados puedan
ver los pedidos pendientes, con diferentes estados:

-   Pendiente de hacer (código P) (Pendiente)
-   Pendiente de enviar (código A) (Albarán Generado)
-   Enviado (código F) (Facturado)
    Estos códigos están ideados para mantener compatibilidad con el
    software preexistente, puede ser cambiado para adptarlo a diferentes
    entornos

Serie ha de tener 3 caracteres alfanuméricos, y número 7 caracteres
también alfanuméricos

Cada pedido incluirá tanto los productos a enviar y su cantidad
como los datos del cliente fiscales y de envío

Se ha de incluir una opción que envíe a la empresa de transporte
un correo electrónico con la información de la recogida y entrega

Al marcar como enviado un pedido, se ha de generar un albarán y
se ha de enviar por correo electrónico al cliente

Se ha de crear un usuario administrador durante la instalación.
Solo un usuario administrador tiene permiso para crear nuevos usuarios
O cambiar los permisos de los usuarios

## Instalar

1. Instalar las dependencias mediante el comando `npm install` o `npm i`.

2. Guardar el archivo `.env.example` como `.env` y cubrir los datos necesarios.

3. Insertar en DEV los datos del primer usuario del programa, con derechos de administrador

4. Ejecutar `npm run initDb` para crear las tablas necesarias en la base de datos.

5. Ejecutar `npm run dev` para lanzar el servidor.

## Base de datos

### users

| Campo      | Tipo         | Descripción                                  |
| ---------- | ------------ | -------------------------------------------- |
| id         | INT UNSIGNED | Identificador único del usuario              |
| username   | VARCHAR(30)  | Nombre de usuario del usuario                |
| password   | VARCHAR(100) | Contraseña del usuario (hash)                |
| email      | VARCHAR(100) | Mail para enviar el albarán                  |
| code       | VARCHAR(10)  | Codigo identificativo del usuario            |
| role       | ENUM         | Rol("admin", "empleado", comercial, cliente) |
| createdAt  | DATETIME     | Fecha y hora de creación del usuario         |
| modifiedAt | DATETIME     | Fecha y hora de la última modificación       |

### invoice_headers

| Campo                | Tipo             | Descripción                          |
| -------------------- | ---------------- | ------------------------------------ |
| id                   | INT UNSIGNED     | Identificador único del pedido       |
| type                 | ENUM             | Solo cambia al siguiente valor si    |
|                      |                  | todas las líneas lo han hecho ya     |
| series               | CHAR(3)          | Serie de Facturación                 |
| number               | CHAR(7)          | Numero de pedido                     |
| client_number        | VARCHAR(7)       | Numero que nos dá el cliente         |
| date                 | DATE             | Fecha de recepción del pedido        |
| delivery_date        | DATE             | Para pedidos con retraso solicitado  |
| client_id            | INT UNSIGNED     | Identificador único del cliente      |
| cif                  | VARCHAR(10)      | CIF del cliente. NIE tienen 10 char  |
| fiscal_name          | VARCHAR(50)      | Nombre fiscal del cliente            |
| address              | VARCHAR(100)     | Dirección de facturación             |
| postal_code          | CHAR(5)          | Código postal de facturación         |
| city                 | VARCHAR(50)      | Población de facturación             |
| country              | VARCHAR(50)      | País de facturación                  |
| phone                | VARCHAR(15)      | Teléf de la dirección de facturación |
| email                | VARCHAR(50)      | Mail de la dirección de facturación  |
| shipping_name        | VARCHAR(10)      | Nombre de la dirección de entrega    |
| shipping_address     | VARCHAR(100)     | Dirección de entrega                 |
| shipping_postal_code | CHAR(5)          | Codigo postal de entrega             |
| shipping_city        | VARCHAR(50)      | Población de entrega                 |
| shipping_country     | VARCHAR(50)      | País de entrega                      |
| shipping_phone       | VARCHAR(15)      | Teléfono de la dirección de entrega  |
| agent_id             | INT UNSIGNED     | Identificador único del agente       |
| packages             | TINYINT UNSIGNED | Numero de bultos del pedido          |
| observations         | TEXT             | Observaciones internas y comentarios |
| createdAt            | DATETIME         | Fecha y hora de creación del usuario |
| modifiedAt           | DATETIME         | Fecha y hora de última modificación  |

### invoice_lines

| Campo         | Tipo             | Descripción                             |
| ------------- | ---------------- | --------------------------------------- |
| id            | INT UNSIGNED     | Identificador único de la linea         |
| header_id     | INT UNSIGNED     | id de la cabecera asociada              |
| line          | TINYINT UNSIGNED | Número de linea del pedido              |
| type          | ENUM             | Pendiente, Alistado, Facturado          |
| reference     | VARCHAR(15)      | Código del producto                     |
| name          | VARCHAR(30)      | Nombre del producto                     |
| description   | VARCHAR(30)      | Descripción del producto                |
| format        | VARCHAR(20)      | Formato en que se sirve el producto     |
| ordered_units | DECIMAL(7, 2)    | Unidades pedidas por el cliente         |
| served_units  | DECIMAL(7, 2)    | Unidades praparadas/enviadas            |
| adr_text      | TEXT             | Información sobre mercancías peligrosas |
| createdAt     | DATETIME         | Fecha y hora de creación del usuario    |
| modifiedAt    | DATETIME         | Fecha y hora de última modificación     |

## Endpoints del usuario

✅

-   **POST** - [`/api/users/register`] - Crea un nuevo usuario, -requiere token de administrador. ✅
-   **POST** - [`/api/users/login`] - Logea a un usuario retornando un token. ✅
-   **PUT** - [`/api/users/:iduser`] - Actualiza los datos de un usuario
-   **GET** - [`/api/users`] - Retorna información privada del usuario con el id del token. ✅
-   **GET** - [`/api/users/all`] - Retorna información de todos los usuarios -requiere token de administrador. ✅
-   **DELETE** - [`/api/users`] - Borra el usuario con el id del token. ✅
-   **DELETE** - [`/api/users/:iduser`] - Borra el usuario con el iduser -requiere token de administrador. ✅

## Endpoints de almacen

-   **POST** - [`/api/warehouse`] - Inserta un conjunto de pedidos completos ✅
-   **POST** - [`/api/warehouse/:type/:series/:number`] - Añade un conjunto de líneas a un pedido ✅

-   **GET** - [`/api/warehouse`] - Retorna el listado completo de pedidos ✅
-   **GET** - [`/api/warehouse/:type`] - Retorna el listado de pedidos del tipo especificado ✅
-   **GET** - [`/api/warehouse/:type/:series/:number`] - Retorna un pedido ✅

-   **PUT** - [`/api/warehouse/order`] - Corrige un pedido ✅
-   **PUT** - [`/api/warehouse/line`] - Corrige una línea ✅
-   **PUT** - [`/api/warehouse/Units`] - Cambia el número de unidades que se enviarán de una línea ✅

-   **PUT** - [`/api/warehouse/check/:type/:series/:number`] - Marca un pedido para enviar. P->A
-   **PUT** - [`/api/warehouse/check/:type/:series/:number/:line`] - Marca una línea para enviar P->A

-   **PUT** - [`/api/warehouse/uncheck/:type/:series/:number`] - Desmarca un pedido para enviar. A->P
-   **PUT** - [`/api/warehouse/uncheck/:type/:series/:number/:line`] - Desmarca una línea para enviar A-P

-   **PUT** - [`/api/warehouse/send/:type/:series/:number`] - Marca un pedido como enviado. A->F

-   **PUT** - [`/api/warehouse/unsend/:type/:series/:number`] - Desmarca un pedido como enviado. F->A

-   **PUT** - [`/api/warehouse/shippingemail`] - envía un correo electrónico a la empresa de transporte

-   **DELETE** - [`/api/warehouse`] -Elimina el listado completo de pedidos
-   **DELETE** - [`/api/warehouse/:type/:series/:number`] - Elimina un pedido
-   **DELETE** - [`/api/warehouse/:type/:series/:number/:line`] - Elimina una linea
