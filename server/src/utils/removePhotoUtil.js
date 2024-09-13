//importamos las dependencias prra las rutas
import path from 'path';
import fs from 'fs/promises';

import generateErrorUtil from './generateErrorUtil.js';

/**
 * Función que elimina una foto de la carpeta uploads
 * @param {File} imgName - Imagen para ser guardada.
 * @description - Elimina una foto de la carpeta Uploads en caso de que exista
 */
const removePhotoUtil = async (imgName) => {
    try {
        const imgPath = path.join(
            process.cwd(),
            process.env.UPLOADS_DIR,
            imgName,
        );
        try {
            //intentamos acceder al archivo que queremos borrar, si no existe, lanzará un error
            await fs.access(imgPath);
            //si estamos aquí, el arvhivo existe: lo eliminamos
            await fs.unlink(imgPath);
        } catch {
            //si la imagen no existe, access lanza un error, y acabamos aquí
            return;
        }
    } catch (err) {
        console.error(err);
        generateErrorUtil('Error al eliminar archivo de disco', 500);
    }
};

export default removePhotoUtil;
