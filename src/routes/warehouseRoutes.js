import express from 'express';

import {
    deleteAllOrdersController,
    deleteOrderController,
    deleteOrderLineController,
    getAllOrdersController,
    getOrderController,
    addLinesController,
    addOrderController,
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

import { authUserController } from '../middlewares/index.js';

const router = express.Router();

//creamos las rutas

//POST [`/api/warehouse`] - Inserta un conjunto de pedidos completos
router.post(`/api/warehouse`, authUserController, addOrderController);
//POST [`/api/warehouse/:type/:series/:number`] - Añade un conjunto de líneas a un pedido
router.post(
    `/api/warehouse/:type/:series/:number`,
    authUserController,
    addLinesController,
);

//GET [`/api/warehouse`] - Retorna el listado completo de pedidos
router.get(`/api/warehouse`, authUserController, getAllOrdersController);
//GET [`/api/warehouse/:type/:series/:number`] - Retorna un pedido
router.get(
    `/api/warehouse/:type/:series/:number`,
    authUserController,
    getOrderController,
);

//PUT [`/api/warehouse/:type/:series/:number`] - Corrige un pedido
router.put(
    `/api/warehouse/:type/:series/:number`,
    authUserController,
    updateOrderController,
);
//PUT [`/api/warehouse/:type/:series/:number/:line`] - Corrige una línea
router.put(
    `/api/warehouse/:type/:series/:number/:line`,
    authUserController,
    updateLineController,
);
//PUT [`/api/warehouse/Units/:type/:series/:number/:line`] - Cambia el número de unidades que se enviarán de una línea
router.put(
    `/api/warehouse/Units/:type/:series/:number/:line`,
    authUserController,
    updateServedUnitsController,
);

//PUT [`/api/warehouse/check/:type/:series/:number`] - Marca un pedido para enviar. P->A
router.put(
    `/api/warehouse/check/:type/:series/:number`,
    authUserController,
    markOrderAsReadyController,
);
//PUT [`/api/warehouse/check/:type/:series/:number/:line`] - Marca una línea para enviar P->A
router.put(
    `/api/warehouse/check/:type/:series/:number/:line`,
    authUserController,
    markLineAsReadyController,
);

//PUT [`/api/warehouse/uncheck/:type/:series/:number`] - Desmarca un pedido para enviar. A->P
router.put(
    `/api/warehouse/uncheck/:type/:series/:number`,
    authUserController,
    unmarkOrderAsReadyController,
);
//PUT [`/api/warehouse/uncheck/:type/:series/:number/:line`] - Desmarca una línea para enviar A-P
router.put(
    `/api/warehouse/uncheck/:type/:series/:number/:line`,
    authUserController,
    unmarkLineAsReadyController,
);

//PUT [`/api/warehouse/send/:type/:series/:number`] - Marca un pedido como enviado. A->F
router.put(
    `/api/warehouse/send/:type/:series/:number`,
    authUserController,
    markOrderAsSentController,
);

//PUT [`/api/warehouse/unsend/:type/:series/:number`] - Desmarca un pedido como enviado. F->A
router.put(
    `/api/warehouse/unsend/:type/:series/:number`,
    authUserController,
    unmarkOrderAsSentController,
);

//PUT [`/api/warehouse/shippingemail`] - envía un correo electrónico a la empresa de transporte
router.put(
    `/api/warehouse/shippingemail`,
    authUserController,
    sendTransportOrderController,
);

//DELETE [`/api/warehouse`] -Elimina el listado completo de pedidos
router.delete(`/api/warehouse`, authUserController, deleteAllOrdersController);
//DELETE [`/api/warehouse/:type/:series/:number`] - Elimina un pedido
router.delete(
    `/api/warehouse/:type/:series/:number`,
    authUserController,
    deleteOrderController,
);
//DELETE [`/api/warehouse/:type/:series/:number/:line`] - Elimina una linea
router.delete(
    `/api/warehouse/:type/:series/:number/:line`,
    authUserController,
    deleteOrderLineController,
);

export default router;
