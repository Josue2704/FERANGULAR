const express = require('express');
const sgMail = require('@sendgrid/mail');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); 

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Configura SendGrid
sgMail.setApiKey('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');

async function enviarCorreoConQr(nombre, email, celebracion_id) {
    try {
      const qrResponse = await axios.get('http://192.168.0.7:8000/api/invitados/crearInvitado/', {
        params: { nombre, email, celebracion_id },
        responseType: 'arraybuffer',
      });
  
      console.log('QR generado correctamente');
  
      const qrPath = path.join(__dirname, 'qr_code.png');
      fs.writeFileSync(qrPath, qrResponse.data);
  
      const msg = {
        to: email,
        from: 'ia.emiliano@ufg.edu.sv',
        subject: `¡Bienvenido, ${nombre}!`,
        text: `Hola ${nombre},\n\nGracias por registrarte en la celebración ${celebracion_id}. Adjuntamos tu código QR.`,
        attachments: [
          {
            content: qrResponse.data.toString('base64'),
            filename: 'qr_code.png',
            type: 'image/png',
            disposition: 'attachment',
          },
        ],
      };
  
      await sgMail.send(msg);
      console.log('Correo enviado correctamente a', email);
  
      fs.unlinkSync(qrPath);
  
      return { success: true, message: 'Correo enviado correctamente.' };
    } catch (error) {
      console.error('Error al enviar el correo:', error.message);
      return { success: false, message: `Error: ${error.message}` };
    }
  }
  
app.post('/api/registrar-usuario', async (req, res) => {
    const { nombre, email, celebracion_id } = req.body;
  
    console.log('Datos recibidos:', nombre, email, celebracion_id); // Verificar datos recibidos
  
    if (!nombre || !email || !celebracion_id) {
      console.error('Campos faltantes');
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }
  
    try {
      const result = await enviarCorreoConQr(nombre, email, celebracion_id);
      console.log('Resultado del envío:', result);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error inesperado en el servidor:', error.message);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  });
  

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

