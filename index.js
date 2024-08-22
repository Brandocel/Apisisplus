const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173' // Cambia esto a la URL de tu frontend en producción
}));
app.use(bodyParser.json());

app.post('/api/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  let transporter = nodemailer.createTransport({
    host: 'webmail.universopc.mx',
    port: 465, // o 587 si estás usando TLS
    secure: true, 
    auth: {
      user: 'soporte@universopc.mx',
      pass: 'Spectrum3821$'
    },
    tls: {
      rejectUnauthorized: false 
    }
  });

  let mailOptions = {
    from: `"${name}" <${email}>`, 
    to: 'soporte@universopc.mx', 
    subject: `Nuevo mensaje de ${name}`, 
    text: message, 
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Correo enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).send('Error al enviar el correo');
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log('Servidor escuchando en el puerto 3001');
});
