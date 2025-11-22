require('dotenv').config();
const app = require('./src/app');
const db = require('./src/database/models');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('='.repeat(60));
    console.log('🚀 Iniciando ISP Management System Backend...');
    console.log('='.repeat(60));

    const connected = await db.testConnection();
    
    if (!connected) {
      console.error('❌ No se pudo conectar a la base de datos');
      console.error('   Verifica tu configuración en el archivo .env');
      process.exit(1);
    }

    if (process.env.NODE_ENV === 'development' && process.env.DB_SYNC === 'true') {
      console.log('⏳ Sincronizando modelos...');
      await db.sync({ alter: false });
      console.log('✅ Modelos sincronizados con la base de datos');
    }

    const server = app.listen(PORT, () => {
      console.log('');
      console.log('='.repeat(60));
      console.log('✅ SERVIDOR INICIADO EXITOSAMENTE');
      console.log('='.repeat(60));
      console.log(`📍 Puerto:          ${PORT}`);
      console.log(`🌍 Ambiente:        ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Base de datos:   ${process.env.DB_DATABASE}`);
      console.log(`🔗 URL Local:       http://localhost:${PORT}`);
      console.log(`📖 API Docs:        http://localhost:${PORT}/api`);
      console.log('='.repeat(60));
      console.log('');
      console.log('💡 Presiona CTRL + C para detener el servidor');
      console.log('');
    });

    process.on('SIGTERM', () => gracefulShutdown(server));
    process.on('SIGINT', () => gracefulShutdown(server));

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

async function gracefulShutdown(server) {
  console.log('');
  console.log('='.repeat(60));
  console.log('⏳ Cerrando servidor de forma segura...');
  
  server.close(async () => {
    console.log('✅ Servidor HTTP cerrado');
    
    try {
      await db.closeConnection();
      console.log('✅ Conexión a BD cerrada');
      console.log('='.repeat(60));
      console.log('👋 ¡Hasta luego!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error al cerrar conexión a BD:', error);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error('⚠️  Forzando cierre del servidor...');
    process.exit(1);
  }, 10000);
}

// Mejorado: Manejo de errores no capturados
// Los unhandledRejection no cierran el servidor inmediatamente
// para permitir que continúe funcionando y podamos ver el error
process.on('unhandledRejection', (reason, promise) => {
  console.error('');
  console.error('='.repeat(60));
  console.error('❌ Unhandled Rejection detectado');
  console.error('='.repeat(60));
  console.error('Promise:', promise);
  console.error('Reason:', reason);
  if (reason instanceof Error) {
    console.error('Error message:', reason.message);
    console.error('Stack:', reason.stack);
  }
  console.error('='.repeat(60));
  console.error('⚠️  El servidor continuará ejecutándose, pero este error debe ser corregido.');
  console.error('');
});

// Mejorado: Las excepciones no capturadas son críticas
// pero damos tiempo para que se loguee el error antes de cerrar
process.on('uncaughtException', (error) => {
  console.error('');
  console.error('='.repeat(60));
  console.error('❌ Uncaught Exception detectada');
  console.error('='.repeat(60));
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  console.error('='.repeat(60));
  console.error('⚠️  El servidor se cerrará en 5 segundos debido a esta excepción crítica...');
  console.error('');
  setTimeout(() => {
    process.exit(1);
  }, 5000);
});

startServer();
