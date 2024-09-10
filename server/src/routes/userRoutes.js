//importamos express para crear las rutas
import express from 'express';

//importamos los controladores
import {
    addUserController,
    loginController,
    updateUserController,
    getUserController,
    getAllUsersController,
    deleteUserController,
    deleteSelfController,
} from '../controllers/users/index.js';
import {
    authUserController,
    authWorkerController,
} from '../middlewares/index.js';

//creamos el router
const router = express.Router();

//creamos las rutas

//POST-[`/api/users/register`] - Crea un nuevo usuario, -requiere token de administrador.
router.post(`/users/register`, authWorkerController, addUserController);

//POST-[`/api/users/login`] - Logea a un usuario retornando un token.
router.post(`/users/login`, loginController);

//PUT-[`/api/users`] -  Actualiza los datos de un usuario.
router.put(`/users/:iduser`, authUserController, updateUserController);

//GET-[`/api/users`] - Retorna información privada del usuario con el id del token.
router.get(`/users`, authUserController, getUserController);

//GET-[`/api/users/all`] - Retorna información de todos los usuarios -requiere token de administrador.
router.get(`/users/all`, authWorkerController, getAllUsersController);

//DELETE-[`/api/users`] - Borra el usuario con el id del token.
router.delete(`/users`, authUserController, deleteSelfController);

//DELETE-[`/api/users/:iduser`] - Borra el usuario con el iduser -requiere token de administrador.
router.delete(`/users/:iduser`, authWorkerController, deleteUserController);

//exportamos
export default router;
