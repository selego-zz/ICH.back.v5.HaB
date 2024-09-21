//importamos las dependencias prra las rutas
import path from 'path';
import fs from 'fs/promises';

import generateErrorUtil from './generateErrorUtil.js';

/**
 * Función que elimina un archivo de la carpeta uploads
 * @param {File} fileName - archivo que vamos a eliminar.
 * @description - Elimina un archivo de la carpeta Uploads en caso de que exista
 */
const removeFileUtil = async (fileName) => {
    try {
        const filePath = path.join(
            process.cwd(),
            process.env.UPLOADS_DIR,
            fileName,
        );
        try {
            //intentamos acceder al archivo que queremos borrar, si no existe, lanzará un error
            await fs.access(filePath);
            //si estamos aquí, el arvhivo existe: lo eliminamos
            await fs.unlink(filePath);
        } catch {
            //si la imagen no existe, access lanza un error, y acabamos aquí
            return;
        }
    } catch (err) {
        console.error(err);
        generateErrorUtil('Error al eliminar archivo de disco', 500);
    }
};

export default removeFileUtil;
