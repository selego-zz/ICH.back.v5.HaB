///activamos las variables de entorno
import 'dotenv/config';

//importamos dependencias
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

//importamos las variables globales
const { PORT } = process.env;

//importamos las rutas
import userRouter from './src/routes/userRoutes.js';

//importamos la funcion controladora de errores
import generateError from './src/utils/generateError.js';

//creamos el servidor
const app = express();

//middleware para leer bodys en formato JSON
app.use(express.json());

//middleware que evita problemas de conexión cliente/servidor
app.use(cors);

//middleware para mostrar información de las peticiones entrantes
app.use(morgan('dev'));

//middleware para indicar las rutas
app.use(userRouter);
//app.use(warehoseRouter);

//middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.httpStatus || 500).send({
        status: 'Error',
        message: err.message,
    });
});
//middleware de ruta no encontrada
app.use((req, res, next) => {
    res.status(404).send({
        status: 'Error',
        message: 'Ruta no encontrada',
    });
});

//iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en localhost:${PORT}`);
});
