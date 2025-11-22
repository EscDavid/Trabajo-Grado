require('dotenv').config();

console.log('='.repeat(60));
console.log('🔍 DEBUG: Variables de entorno cargadas');
console.log('='.repeat(60));
console.log('');

console.log('Variables de Base de Datos:');
console.log('  DB_HOST:', process.env.DB_HOST || '(no definido)');
console.log('  DB_PORT:', process.env.DB_PORT || '(no definido)');
console.log('  DB_USERNAME:', process.env.DB_USERNAME || '(no definido)');
console.log('  DB_PASSWORD:', process.env.DB_PASSWORD ? `"${process.env.DB_PASSWORD}" (longitud: ${process.env.DB_PASSWORD.length})` : '(no definido o vacío)');
console.log('  DB_DATABASE:', process.env.DB_DATABASE || '(no definido)');
console.log('');

console.log('Otras variables:');
console.log('  NODE_ENV:', process.env.NODE_ENV || '(no definido)');
console.log('  PORT:', process.env.PORT || '(no definido)');
console.log('');

console.log('Verificación de tipos:');
console.log('  typeof DB_PASSWORD:', typeof process.env.DB_PASSWORD);
console.log('  DB_PASSWORD === undefined:', process.env.DB_PASSWORD === undefined);
console.log('  DB_PASSWORD === null:', process.env.DB_PASSWORD === null);
console.log('  DB_PASSWORD === "":', process.env.DB_PASSWORD === '');
console.log('  DB_PASSWORD length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 'N/A');
console.log('');

// Cargar la configuración de la base de datos
const config = require('../src/config/database.config');
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

console.log('='.repeat(60));
console.log('🔍 Configuración de Base de Datos (desarrollo):');
console.log('='.repeat(60));
console.log('  username:', dbConfig.username);
console.log('  password:', dbConfig.password ? `"${dbConfig.password}" (longitud: ${dbConfig.password.length})` : '(vacío o null)');
console.log('  database:', dbConfig.database);
console.log('  host:', dbConfig.host);
console.log('  port:', dbConfig.port);
console.log('='.repeat(60));







