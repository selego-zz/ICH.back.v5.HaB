import express from 'express';

import {
    deleteAllOrdersController,
    deleteOrderController,
    deleteOrderLineController,
    getAllOrdersController,
    getOrderController,
    addLinesController,
    addOrderController,
    addOrUpdateAllOrdersController,
    addAllOrdersController,
    updateDBController,
    updateLineController,
    updateLineCompletedController,
    updateOrderTypeController,
    updateOrderController,
    updateServedUnitsController,
    sendTransportOrderController,
} from '../controllers/warehouse/index.js';

import {
    authUserController,
    authWorkerController,
} from '../middlewares/index.js';

const router = express.Router();

//creamos las rutas

//POST [`/api/warehouse/updatedb`] - Copia la base de datos desde la raiz del pc, y actualiza la base de datos
router.post(`/warehouse/updatedb`, authWorkerController, updateDBController);

//POST [`/api/warehouse`] - Inserta un conjunto de pedidos completos
router.post(`/warehouse/all`, authWorkerController, addAllOrdersController);
//POST [`/api/warehouse`] - Inserta un conjunto de pedidos completos
router.post(
    `/warehouse/addorupdate`,
    authWorkerController,
    addOrUpdateAllOrdersController,
);
//POST [`/api/warehouse`] - Inserta un conjunto de pedidos completos
router.post(`/warehouse`, authWorkerController, addOrderController);
//POST [`/api/warehouse/:type/:series/:number`] - Añade un conjunto de líneas a un pedido
router.post(
    `/warehouse/:type/:series/:number`,
    authWorkerController,
    addLinesController,
);

//GET [`/api/warehouse`] - Retorna el listado completo de pedidos, si se especifica un tipo, solo los de ese tipo
router.get(`/warehouse/`, authUserController, getAllOrdersController);
router.get(`/warehouse/:type`, authUserController, getAllOrdersController);
//GET [`/api/warehouse/:type/:series/:number`] - Retorna un pedido
router.get(
    `/warehouse/:type/:series/:number`,
    authUserController,
    getOrderController,
);

//PUT [`/api/warehouse/order`] - Corrige un pedido
router.put(`/warehouse/order`, authWorkerController, updateOrderController);
//PUT [`/api/warehouse/line`] - Corrige una línea
router.put(`/warehouse/line`, authWorkerController, updateLineController);
//PUT [`/api/warehouse/Units`] - Cambia el número de unidades que se enviarán de una línea
router.put(
    `/warehouse/Units`,
    authWorkerController,
    updateServedUnitsController,
);

//-   **PUT** - [`/api/warehouse/changeType/:type/:series/:number`] - Cambia el tipo de un pedido. P, A, F
router.put(
    `/warehouse/changeType/:type/:series/:number`,
    authWorkerController,
    updateOrderTypeController,
);
//-   **PUT** - [`/api/warehouse/changeCompleted/:type/:series/:number/:line`] - Cambia el estado 'completa' de una línea
router.put(
    `/warehouse/changeCompleted/:type/:series/:number/:line`,
    authWorkerController,
    updateLineCompletedController,
);

//PUT [`/api/warehouse/shippingemail`] - envía un correo electrónico a la empresa de transporte
router.put(
    `/warehouse/shippingemail`,
    authWorkerController,
    sendTransportOrderController,
);

//DELETE [`/api/warehouse`] -Elimina el listado completo de pedidos
router.delete(`/warehouse`, authWorkerController, deleteAllOrdersController);
//DELETE [`/api/warehouse/:type/:series/:number`] - Elimina un pedido
router.delete(
    `/warehouse/:type/:series/:number`,
    authWorkerController,
    deleteOrderController,
);
//DELETE [`/api/warehouse/:type/:series/:number/:line`] - Elimina una linea
router.delete(
    `/warehouse/:type/:series/:number/:line`,
    authWorkerController,
    deleteOrderLineController,
);

export default router;
