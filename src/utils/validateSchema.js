//no importamos generate error, vamos a aprovechar el error que da el catch, que ya debería tener nuestras frases personalizadas

const validateSchema = async (schema, data) => {
    try {
        await schema.validateAsync(data);
    } catch (err) {
        err.httpStatus = 400;
        throw err;
    }
};

export default validateSchema;
