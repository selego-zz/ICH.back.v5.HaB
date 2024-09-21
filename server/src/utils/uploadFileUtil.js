import path from 'path';
import fs from 'fs/promises';
import generateErrorUtil from './generateErrorUtil.js';

/**
 * Función que guarda una foto de la carpeta uploads
 * @param {File} imgName - Imagen para ser guardada.
 * @param {number} width - tamaño de la imagen
 * @description - comprueba que exista la carpeta uploads, en caso contrario la crea, redimensiona la imagen para que se adapte al tamaño width, la graba con un nombre aleatorio, y devuelve el nombre
 * @returns {string} Devuelve el nombre con el que se ha grabado al imagen en la carpeta uploads
 */
const uploadFileUtil = async (dbPath, destinationName) => {
    try {
        const uploadsPath = path.join(process.cwd(), process.env.UPLOADS_DIR);

        try {
            // comprobamos si existe el directorio
            await fs.access(uploadsPath);
        } catch {
            //si no existe lo creamos
            await fs.mkdir(uploadsPath);
        }

        //generamos la ruta para el archivo
        const dbUploadPath = path.join(uploadsPath, destinationName);

        // Copiamos el archivo de la base de datos a la carpeta uploads
        await fs.copyFile(dbPath, dbUploadPath);
    } catch (err) {
        console.error(err);
        generateErrorUtil('Error al guardar el archivo en disco');
    }
};

export default uploadFileUtil;
