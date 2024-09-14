import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import generateErrorUtil from './generateErrorUtil.js';

/**
 * Función que guarda una foto de la carpeta uploads
 * @param {File} imgName - Imagen para ser guardada.
 * @param {number} width - tamaño de la imagen
 * @description - comprueba que exista la carpeta uploads, en caso contrario la crea, redimensiona la imagen para que se adapte al tamaño width, la graba con un nombre aleatorio, y devuelve el nombre
 * @returns {string} Devuelve el nombre con el que se ha grabado al imagen en la carpeta uploads
 */
const savePhotoUtil = async (img, width) => {
    try {
        const uploadsPath = path.join(process.cwd(), process.env.UPLOADS_DIR);

        try {
            // comprobamos si existe el directorio
            await fs.access(uploadsPath);
        } catch {
            //si no existe lo creamos
            await fs.mkdir(uploadsPath);
        }

        //creamos una imagen de tipo sharp para poder reducirla
        const sharpImg = sharp(img.data);
        sharpImg.resize(width);

        //generamos un nombre para el archivo
        const imgName = `${crypto.randomUUID()}.jpg`;

        //generamos la ruta para el archivo
        const imgPath = path.join(uploadsPath, imgName);

        //guardamos la foto en la carpeta de subidas, con el nombre indicado
        await sharpImg.toFile(imgPath);

        //retornamos el nombre con elque hemos guardado la imagen
        return imgName;
    } catch (err) {
        console.error(err);
        generateErrorUtil('Error al guardar el archivo en disco');
    }
};

export default savePhotoUtil;
