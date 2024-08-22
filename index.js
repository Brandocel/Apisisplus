const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*' // O especifica el origen que deseas permitir, por ejemplo, 'http://localhost:5173'
}));
app.use(bodyParser.json());

app.post('/api/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  // Configura el transporte de nodemailer para usar el servidor SMTP de webmail.universopc.mx
  let transporter = nodemailer.createTransport({
    host: 'webmail.universopc.mx',
    port: 465, // o 587 si estás usando TLS
    secure: true, // true para SSL, false para TLS
    auth: {
      user: 'soporte@universopc.mx',
      pass: 'Spectrum3821$'
    },
    tls: {
      rejectUnauthorized: false // Desactivar la verificación del certificado
    }
  });
  

  // Opciones del correo electrónico
  let mailOptions = {
    from: `"${name}" <${email}>`, // Remitente
    to: 'soporte@universopc.mx', // Destinatario
    subject: `Nuevo mensaje de ${name}`, // Asunto
    text: message, // Contenido del mensaje
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Correo enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).send('Error al enviar el correo');
  }
});

// Inicia el servidor en el puerto 3001
app.listen(3001, () => {
  console.log('Servidor escuchando en el puerto 3001');
});
