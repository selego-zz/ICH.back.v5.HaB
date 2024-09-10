/**
 * Función para generación de errores.
 * @param {string} errMessage - Mensaje de error.
 * @param {number} errCode - código de error.
 * @description Genera un error personalizado con el mensaje y el código suministrados, y lo lanza.
 */
const generateError = (errMessage, errCode) => {
    const err = new Error(errMessage);
    err.httpStatus = errCode;
    throw err;
};
export default generateError;
