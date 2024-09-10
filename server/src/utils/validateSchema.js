//no importamos generate error, vamos a aprovechar el error que da el catch, que ya debería tener nuestras frases personalizadas

/**
 * Función para validar estructuras de datosd antes de ingresarlas en la base de datos.
 * @param {Object} schema - Esquema Joi con el que se comprobarán los datos.
 * @param {Object} data - Json o Array de Json que se va a validar.
 * @description - Valida los datos introducidos en base al esquema Jois suministrado
 * @throws - Si los datos no cumplen el equema lanza un error 400
 */
const validateSchema = async (schema, data) => {
    try {
        await schema.validateAsync(data);
    } catch (err) {
        err.httpStatus = 400;
        throw err;
    }
};

export default validateSchema;
