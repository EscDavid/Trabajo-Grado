const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  async sendPasswordResetEmail(email, resetToken, userName) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'ISP System'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: email,
      subject: 'Recuperación de Contraseña - ISP Management System',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { color: #dc2626; font-weight: bold; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Recuperación de Contraseña</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${userName}</strong>,</p>
              <p>Recibimos una solicitud para restablecer tu contraseña. Si no fuiste tú, puedes ignorar este correo.</p>
              <p>Para restablecer tu contraseña, haz clic en el siguiente botón:</p>
              <center>
                <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
              </center>
              <p>O copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; color: #4F46E5;">${resetUrl}</p>
              <p class="warning">⚠️ Este enlace expirará en 1 hora.</p>
              <p>Si no solicitaste el cambio de contraseña, ignora este mensaje y tu contraseña permanecerá sin cambios.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ISP Management System. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error enviando email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPasswordChangedEmail(email, userName) {
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'ISP System'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: email,
      subject: 'Contraseña Cambiada - ISP Management System',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { color: #dc2626; font-weight: bold; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Contraseña Cambiada</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${userName}</strong>,</p>
              <p>Tu contraseña ha sido cambiada exitosamente.</p>
              <p>Fecha y hora: <strong>${new Date().toLocaleString('es-CO')}</strong></p>
              <p class="warning">⚠️ Si no realizaste este cambio, contacta inmediatamente al administrador.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ISP Management System. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error enviando email:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();