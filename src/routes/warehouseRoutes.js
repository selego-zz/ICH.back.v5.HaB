import express from 'express';

import {
    deleteAllOrdersController,
    deleteOrderController,
    deleteOrderLineController,
    getAllOrdersController,
    getOrderController,
    addLinesController,
    addOrderController,
    addAllOrdersController,
    updateLineController,
    updateOrderController,
    updateServedUnitsController,
    markLineAsReadyController,
    markOrderAsReadyController,
    markOrderAsSentController,
    sendTransportOrderController,
    unmarkLineAsReadyController,
    unmarkOrderAsReadyController,
    unmarkOrderAsSentController,
} from '../controllers/warehouse/index.js';

import {
    authUserController,
    authWorkerController,
} from '../middlewares/index.js';

const router = express.Router();

//creamos las rutas

//POST [`/api/warehouse`] - Inserta un conjunto de pedidos completos
router.post(`/warehouse/all`, authWorkerController, addAllOrdersController);
//POST [`/api/warehouse`] - Inserta un conjunto de pedidos completos
router.post(`/warehouse`, authWorkerController, addOrderController);
//POST [`/api/warehouse/:type/:series/:number`] - Añade un conjunto de líneas a un pedido
router.post(
    `/warehouse/:type/:series/:number`,
    authWorkerController,
    addLinesController,
);

//GET [`/api/warehouse`] - Retorna el listado completo de pedidos, si se especifica un tipo, solo los de ese tipo
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

//PUT [`/api/warehouse/check/:type/:series/:number`] - Marca un pedido para enviar. P->A
router.put(
    `/warehouse/check/:type/:series/:number`,
    authWorkerController,
    markOrderAsReadyController,
);
//PUT [`/api/warehouse/check/:type/:series/:number/:line`] - Marca una línea para enviar P->A
router.put(
    `/warehouse/check/:type/:series/:number/:line`,
    authWorkerController,
    markLineAsReadyController,
);

//PUT [`/api/warehouse/uncheck/:type/:series/:number`] - Desmarca un pedido para enviar. A->P
router.put(
    `/warehouse/uncheck/:type/:series/:number`,
    authWorkerController,
    unmarkOrderAsReadyController,
);
//PUT [`/api/warehouse/uncheck/:type/:series/:number/:line`] - Desmarca una línea para enviar A-P
router.put(
    `/warehouse/uncheck/:type/:series/:number/:line`,
    authWorkerController,
    unmarkLineAsReadyController,
);

//PUT [`/api/warehouse/send/:type/:series/:number`] - Marca un pedido como enviado. A->F
router.put(
    `/warehouse/send/:type/:series/:number`,
    authWorkerController,
    markOrderAsSentController,
);

//PUT [`/api/warehouse/unsend/:type/:series/:number`] - Desmarca un pedido como enviado. F->A
router.put(
    `/warehouse/unsend/:type/:series/:number`,
    authWorkerController,
    unmarkOrderAsSentController,
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
