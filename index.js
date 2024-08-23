const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Configurar CORS para permitir solicitudes desde cualquier origen
app.use(cors());

app.use(bodyParser.json());

// Ruta de bienvenida en la raíz
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de Contacto de Sistemas Plus Caribe!');
});

app.post('/api/send-email', async (req, res) => {
  const { name, email, message, captchaToken } = req.body;

  // Verifica el reCAPTCHA v3
  const secretKey = '6Lf1MCOqAAAAAPrzFkCYptvGafUE7Gc2m0tyYBmo';
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;

  try {
    const response = await axios.post(verificationUrl);
    const { success, score } = response.data;

    if (!success || score < 0.5) {
      return res.status(400).json({ message: 'Falló la verificación del captcha. Inténtalo nuevamente.' });
    }

    // Configuración de nodemailer para enviar el correo
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

    await transporter.sendMail(mailOptions);
    res.status(200).send('Correo enviado con éxito');
  } catch (error) {
    console.error('Error al verificar el captcha o enviar el correo:', error);
    res.status(500).send('Error al verificar el captcha o enviar el correo');
  }
});

// Inicia el servidor en el puerto asignado
app.listen(process.env.PORT || 3001, () => {
  console.log('Servidor escuchando en el puerto 3001');
});
