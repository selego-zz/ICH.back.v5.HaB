///activamos las variables de entorno
import 'dotenv/config';

//importamos dependencias
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

//importamos las variables globales
const { PORT } = process.env;

//importamos las rutas
import {
    userRouter,
    warehoseRouter,
    shippingRouter,
} from './src/routes/index.js';

//creamos el servidor
const app = express();

//middleware que evita problemas de conexión cliente/servidor
app.use(cors());

//middleware para mostrar información de las peticiones entrantes
app.use(morgan('dev'));

//middleware para leer bodys en formato JSON
app.use(express.json());

//middleware para indicar las rutas
app.use('/api', userRouter);
app.use('/api', warehoseRouter);
app.use('/api', shippingRouter);

//middleware de manejo de errores
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.httpStatus || 500).send({
        status: 'Error',
        message: err.message,
    });
});
//middleware de ruta no encontrada
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
    console.log('ruta no encontrada');

    res.status(404).send({
        status: 'Error',
        message: 'Ruta no encontrada',
    });
});

//iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en localhost:${PORT}`);
});
