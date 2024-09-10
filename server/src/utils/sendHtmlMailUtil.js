import nodemailer from 'nodemailer';
import generateError from './generateError.js';

//importamos las variable de entorno para el envío de correos electrónicos

const { SMTP_PORT, SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;

// crea un transporte (consexión) para poder enviar el mail
const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

/**
 * Función que envía un correo electrónico
 * @param {string} email - Email al que va destinado el correo electrónico
 * @param {string} subject - Asunto del correo electrónico
 * @param {string} body - Cuerpo del correo electrónico
 * @description - Envía un correo electrónico a la dirección suministrada en email, con el asunto indicado en subject, y el texto incluido en body
 */
const sendHtmlMail = async (email, subject, body) => {
    /*     console.log(`
        SMTP_HOST: ${SMTP_HOST}
        SMTP_PORT: ${SMTP_PORT}
        SMTP_USER: ${SMTP_USER}
        SMTP_PASS: ${SMTP_PASS}
        receiverEmail: ${email}
        subject: ${subject}
        body: ${body}
        `);
 */
    try {
        const info = await transport.sendMail({
            from: SMTP_USER,
            to: email,
            subject,
            html: body,
        });
        return info;
    } catch (err) {
        console.log(err);

        generateError('error al enviar el mail', 500);
    }
};

export default sendHtmlMail;
