// const nodemailer = require("nodemailer");

// // Configura tu email y contraseña aquí o usa variables de entorno para mayor seguridad
// const EMAIL_USER = process.env.EMAIL_USER || "limaluis673@gmail.com";
// const EMAIL_PASS = process.env.EMAIL_PASS;

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: EMAIL_USER,
//     pass: EMAIL_PASS,
//   },
// });

// /**
//  * Envía un correo electrónico
//  * @param {Object} options
//  * @param {string} options.to - Destinatario
//  * @param {string} options.subject - Asunto
//  * @param {string} options.text - Texto plano
//  * @param {string} [options.html] - HTML opcional
//  * @returns {Promise}
//  */
// function sendEmail({ to, subject, text, html }) {
//   return transporter.sendMail({
//     from: EMAIL_USER,
//     to,
//     subject,
//     text,
//     html,
//   });
// }

// module.exports = { sendEmail };
const nodemailer = require("nodemailer");

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  connectionTimeout: 10000, // 10s
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Verificación opcional (solo logs)
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP error:", error.message);
  } else {
    console.log("SMTP listo para enviar emails");
  }
});

/**
 * Envía un correo electrónico
 */
function sendEmail({ to, subject, text, html }) {
  return transporter.sendMail({
    from: `"Billing System" <${EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendEmail };
