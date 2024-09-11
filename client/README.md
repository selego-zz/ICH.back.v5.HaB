Api routes:

## Endpoints del usuario

✅

-   **POST** - [`/api/users/register`] - Crea un nuevo usuario, -requiere token de administrador.
-   **POST** - [`/api/users/login`] - Logea a un usuario retornando un token. ✅
-   **PUT** - [`/api/users/:iduser`] - Actualiza los datos de un usuario ✅
-   **GET** - [`/api/users`] - Retorna información privada del usuario con el id del token. ✅
-   **GET** - [`/api/users/all`] - Retorna información de todos los usuarios -requiere token de administrador.
-   **DELETE** - [`/api/users`] - Borra el usuario con el id del token. ✅ // aunque la api lo permita, no lo vamos a borrar, le cambiaremos la clave para que sea inaccesible. Solo el usuario root puede borrar un cliente
-   **DELETE** - [`/api/users/:iduser`] - Borra el usuario con el iduser -requiere token de administrador.

## Endpoints de almacen

-   **POST** - [`/api/warehouse`] - Inserta un conjunto de pedidos completos ✅
-   **POST** - [`/api/warehouse/:type/:series/:number`] - Añade un conjunto de líneas a un pedido ✅

-   **GET** - [`/api/warehouse`] - Retorna el listado completo de pedidos ✅
-   **GET** - [`/api/warehouse/:type`] - Retorna el listado de pedidos del tipo especificado ✅
-   **GET** - [`/api/warehouse/:type/:series/:number`] - Retorna un pedido ✅

-   **PUT** - [`/api/warehouse/order`] - Corrige un pedido ✅
-   **PUT** - [`/api/warehouse/line`] - Corrige una línea ✅
-   **PUT** - [`/api/warehouse/Units`] - Cambia el número de unidades que se enviarán de una línea ✅

-   **PUT** - [`/api/warehouse/changeType/:type/:series/:number`] - Cambia el tipo de un pedido. P, A, F ✅
-   **PUT** - [`/api/warehouse/changeType/:type/:series/:number/:line`] - Cambia el tipo de una línea. P, A, F ✅

-   **PUT** - [`/api/warehouse/shippingemail`] - envía un correo electrónico a la empresa de transporte ✅

-   **DELETE** - [`/api/warehouse`] -Elimina el listado completo de pedidos ✅
-   **DELETE** - [`/api/warehouse/:type/:series/:number`] - Elimina un pedido ✅
-   **DELETE** - [`/api/warehouse/:type/:series/:number/:line`] - Elimina una linea ✅

## Endpoints de empresa de transporte

-   **POST** - [`/api/shipping`] - Inserta una empresa de transporte ✅

-   **GET** - [`/api/shipping`] - Retorna el listado completo de empresas de transporte ✅
-   **GET** - [`/api/shipping/:id`] - Retorna los datos de una empresa de transporte ✅

-   **PUT** - [`/api/shipping`] - Actualiza los datos de una empresa de transporte ✅
-   **PUT** - [`/api/shipping/setdefault/:id`] - Establece una empresa de transporte como la de uso habitual ✅

-   **DELETE** - [`/api/shipping/:id`] -Elimina los datos de una empresa de transporte ✅
