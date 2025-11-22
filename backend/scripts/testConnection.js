require('dotenv').config();
const db = require('../src/database/models');

async function testConnection() {
  try {
    console.log('='.repeat(60));
    console.log('🔌 Probando conexión a la base de datos...');
    console.log('='.repeat(60));
    
    // Cargar la configuración para mostrar exactamente qué se está usando
    const config = require('../src/config/database.config');
    const env = process.env.NODE_ENV || 'development';
    const dbConfig = config[env];
    
    console.log(`📊 Base de datos: ${dbConfig.database}`);
    console.log(`🏠 Host: ${dbConfig.host}`);
    console.log(`🔌 Puerto: ${dbConfig.port}`);
    console.log(`👤 Usuario: ${dbConfig.username}`);
    console.log(`🔑 Contraseña: ${dbConfig.password ? '***' + dbConfig.password.slice(-2) + ' (configurada)' : '❌ NO CONFIGURADA (vacía o null)'}`);
    console.log('');
    console.log('📝 Variables del .env:');
    console.log(`   DB_PASSWORD desde .env: "${process.env.DB_PASSWORD || '(vacía o no definida)'}"`);
    console.log('='.repeat(60));
    console.log('');

    if (!dbConfig.password) {
      console.log('⚠️  ADVERTENCIA: No se ha configurado una contraseña.');
      console.log('   Si tu usuario de MySQL requiere contraseña, la conexión fallará.');
      console.log('   Edita el archivo .env y agrega: DB_PASSWORD=tu_contraseña');
      console.log('');
    }

    const connected = await db.testConnection();
    
    if (connected) {
      console.log('');
      console.log('='.repeat(60));
      console.log('✅ ¡Conexión exitosa!');
      console.log('='.repeat(60));
      
      // Probar una consulta simple y obtener información
      try {
        const [dbResults] = await db.sequelize.query("SELECT DATABASE() as current_db");
        console.log(`📊 Base de datos actual: ${dbResults[0].current_db}`);
        
        // Listar tablas
        const [tables] = await db.sequelize.query("SHOW TABLES");
        console.log(`📋 Tablas encontradas: ${tables.length}`);
        if (tables.length > 0) {
          console.log('   Tablas:');
          tables.forEach((table, index) => {
            const tableName = Object.values(table)[0];
            console.log(`   ${index + 1}. ${tableName}`);
          });
        } else {
          console.log('   ℹ️  No hay tablas en la base de datos aún.');
        }
      } catch (queryError) {
        console.log('⚠️  No se pudieron obtener detalles adicionales:', queryError.message);
      }
      
      await db.closeConnection();
      process.exit(0);
    } else {
      console.log('');
      console.log('='.repeat(60));
      console.log('❌ No se pudo conectar a la base de datos');
      console.log('='.repeat(60));
      console.log('');
      console.log('💡 Verifica:');
      console.log('   1. Que MySQL esté corriendo');
      console.log('   2. Que las credenciales en .env sean correctas');
      console.log('   3. Que la base de datos exista');
      console.log('   4. Que el usuario tenga permisos para acceder');
      console.log('');
      process.exit(1);
    }
  } catch (error) {
    console.error('');
    console.error('='.repeat(60));
    console.error('❌ Error al probar la conexión:');
    console.error('='.repeat(60));
    console.error(error.message);
    console.error('');
    
    if (error.name === 'SequelizeConnectionError') {
      console.log('💡 Posibles soluciones:');
      console.log('   1. Verifica que MySQL esté instalado y corriendo');
      console.log('   2. Verifica que el servidor MySQL esté en el puerto correcto');
      console.log('   3. Verifica las credenciales en el archivo .env');
      console.log('');
    } else if (error.name === 'SequelizeAccessDeniedError') {
      console.log('💡 Posibles soluciones:');
      console.log('   1. Verifica el usuario y contraseña en .env');
      console.log('   2. Asegúrate de que el usuario tenga permisos');
      console.log('');
    } else if (error.name === 'SequelizeDatabaseError') {
      console.log('💡 Posibles soluciones:');
      console.log('   1. Verifica que la base de datos exista');
      console.log('   2. Crea la base de datos si no existe');
      console.log('');
    }
    
    process.exit(1);
  }
}

testConnection();


