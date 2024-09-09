//importamos express para crear las rutas
import express from 'express';

//importamos los controladores
import {
    addShippingCompanyController,
    getAllShippingCompanyController,
    getShippingCompanyController,
    updateShippingCompanyController,
    setDefaultShippingCompanyController,
    deleteShippingCompanyController,
} from '../controllers/shipping/index.js';
import { authWorkerController } from '../middlewares/index.js';

//creamos el router
const router = express.Router();

//creamos las rutas

//POST- [`/api/shipping`] - Inserta una empresa de transporte
router.post(`/shipping`, authWorkerController, addShippingCompanyController);

//GET- [`/api/shipping`] - Retorna el listado completo de empresas de transporte
router.get(`/shipping`, authWorkerController, getAllShippingCompanyController);

//GET- [`/api/shipping/:id`] - Retorna los datos de una empresa de transporte
router.get(`/shipping/:id`, authWorkerController, getShippingCompanyController);

//PUT- [`/api/shipping`] - Actualiza los datos de una empresa de transporte
router.put(`/shipping`, authWorkerController, updateShippingCompanyController);
//PUT- [`/api/shipping/setdefault/:id`] - Establece una empresa de transporte como la de uso habitual
router.put(
    `/shipping/setdefault/:id`,
    authWorkerController,
    setDefaultShippingCompanyController,
);

//DELETE- [`/api/shipping/:id`] -Elimina los datos de una empresa de transporte
router.delete(
    `/shipping/:id`,
    authWorkerController,
    deleteShippingCompanyController,
);

//exportamos
export default router;
