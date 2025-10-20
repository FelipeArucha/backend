const nodemailer = require('nodemailer')

// Configura tu email y contraseña aquí o usa variables de entorno para mayor seguridad
const EMAIL_USER = process.env.EMAIL_USER || 'limaluis673@gmail.com'
const EMAIL_PASS = process.env.EMAIL_PASS

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
})

/**
 * Envía un correo electrónico
 * @param {Object} options
 * @param {string} options.to - Destinatario
 * @param {string} options.subject - Asunto
 * @param {string} options.text - Texto plano
 * @param {string} [options.html] - HTML opcional
 * @returns {Promise}
 */
function sendEmail({ to, subject, text, html }) {
  return transporter.sendMail({
    from: EMAIL_USER,
    to,
    subject,
    text,
    html
  })
}

module.exports = { sendEmail }
