const express = require('express')
const router = express.Router()
const { sendEmail } = require('../utils/email')

// Ruta de prueba para envío de email
router.post('/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body
  try {
    await sendEmail({ to, subject, text, html })
    res.json({ success: true, message: 'Correo enviado correctamente.' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
