require('dotenv').config();

console.log('='.repeat(60));
console.log('🔍 DIAGNÓSTICO DEL BACKEND');
console.log('='.repeat(60));
console.log('');

// 1. Verificar variables de entorno
console.log('📋 Variables de entorno:');
console.log('   DB_HOST:', process.env.DB_HOST || '❌ NO DEFINIDO');
console.log('   DB_USERNAME:', process.env.DB_USERNAME || '❌ NO DEFINIDO');
console.log('   DB_PASSWORD:', process.env.DB_PASSWORD ? '✅ DEFINIDO' : '❌ NO DEFINIDO');
console.log('   DB_DATABASE:', process.env.DB_DATABASE || '❌ NO DEFINIDO');
console.log('   DB_PORT:', process.env.DB_PORT || '❌ NO DEFINIDO');
console.log('   PORT:', process.env.PORT || '❌ NO DEFINIDO');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('');

// 2. Verificar carga de módulos
console.log('📦 Verificando carga de módulos...');
try {
  const app = require('../src/app');
  console.log('   ✅ app.js se carga correctamente');
} catch (error) {
  console.error('   ❌ Error al cargar app.js:', error.message);
  console.error('   Stack:', error.stack);
  process.exit(1);
}

try {
  const db = require('../src/database/models');
  console.log('   ✅ models/index.js se carga correctamente');
} catch (error) {
  console.error('   ❌ Error al cargar models:', error.message);
  console.error('   Stack:', error.stack);
  process.exit(1);
}

try {
  const routes = require('../src/api/routes');
  console.log('   ✅ routes/index.js se carga correctamente');
} catch (error) {
  console.error('   ❌ Error al cargar routes:', error.message);
  console.error('   Stack:', error.stack);
  process.exit(1);
}

// 3. Verificar conexión a BD
console.log('');
console.log('🔌 Verificando conexión a base de datos...');
const db = require('../src/database/models');
db.testConnection()
  .then(connected => {
    if (connected) {
      console.log('   ✅ Conexión a BD exitosa');
    } else {
      console.log('   ❌ No se pudo conectar a la BD');
    }
    return db.closeConnection();
  })
  .then(() => {
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ DIAGNÓSTICO COMPLETADO');
    console.log('='.repeat(60));
    process.exit(0);
  })
  .catch(error => {
    console.error('   ❌ Error:', error.message);
    console.error('   Stack:', error.stack);
    process.exit(1);
  });

