const generateError = (errMessage, errCode) => {
    const err = new Error(errMessage);
    err.httpStatus = errCode;
    throw err;
};
export default generateError;
