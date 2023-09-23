import nodemailer from 'nodemailer';
import config from '../config/config.js';

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 8080,
    auth:{
        user: config.adminGmail,
        pass: config.adminPass
    },
    tls: {
        rejectUnauthorized: false // Desactiva la verificación del certificado
      }
})

export default transport