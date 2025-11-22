require('dotenv').config();
const emailService = require('../src/services/email.service');

async function testEmail() {
  console.log('\n🧪 Probando servicio de email...\n');
  
  const testEmail = process.argv[2] || process.env.SMTP_USER;
  
  if (!testEmail) {
    console.error('❌ Por favor proporciona un email de prueba:');
    console.error('   node scripts/testEmail.js tu_email@gmail.com\n');
    process.exit(1);
  }

  console.log(`📧 Enviando email de prueba a: ${testEmail}`);
  
  try {
    const result = await emailService.sendPasswordResetEmail(
      testEmail,
      'abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef',
      'Usuario de Prueba'
    );

    if (result.success) {
      console.log('✅ Email enviado exitosamente!\n');
      console.log('Revisa tu bandeja de entrada (y carpeta de spam).\n');
    } else {
      console.error('❌ Error al enviar email:', result.error, '\n');
    }
  } catch (error) {
    console.error('❌ Error:', error.message, '\n');
  }
  
  process.exit(0);
}

testEmail();