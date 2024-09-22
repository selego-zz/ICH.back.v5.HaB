const generateRecoverPassMailUtil = (username, recoverPassCode) => {
    const recoveryLink =
        process.env.CLIENT_URL + '/recoverPass/' + recoverPassCode;

    const mail = `<h2>Recuperación de contraseña</h2>
<br>
<h3>Hola ${username}</h3>
<p>Estás recibiendo este correo electrónico por que alguien ha intentado recuperar tu contraseña de nuestro gestor de almacén</p>
<p>Si quieres cambiar tu contraseña, te basta pulsar en el siguiente enlace, e introducir una contraseña nueva. ¡No olvides poner repetir la nuneva contraseña en la casilla de contraseña repetida, o no podrás cambiar tu contraseña!</p>
<p>En enlace de recuperación de contraseña es: <a href='${recoveryLink}'>${recoveryLink}</a></p>
    `;

    return mail;
};
export default generateRecoverPassMailUtil;
