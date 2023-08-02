import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 8080,
    auth:{
        user: "juan21casarino@gmail.com",
        pass: "ztemwurlwtsekcxm"
    },
    tls: {
        rejectUnauthorized: false // Desactiva la verificación del certificado
      }
})
const html = ''

export default transport