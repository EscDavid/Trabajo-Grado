require('dotenv').config();
const db = require('../src/database/models');

async function checkUsers() {
  try {
    console.log('='.repeat(60));
    console.log('🔍 Verificando usuarios en la base de datos...');
    console.log('='.repeat(60));
    console.log('');

    // Conectar a la base de datos
    await db.testConnection();

    // Buscar usuarios usando consulta SQL directa para evitar problemas con el modelo
    const [users] = await db.sequelize.query(`
      SELECT id, username, email, full_name, is_active 
      FROM users 
      LIMIT 10
    `);

    console.log(`📊 Usuarios encontrados: ${users.length}`);
    console.log('');

    if (users.length === 0) {
      console.log('⚠️  No hay usuarios en la base de datos.');
      console.log('');
      console.log('💡 Para crear un usuario de prueba, puedes:');
      console.log('   1. Usar el endpoint POST /api/auth/register (requiere autenticación)');
      console.log('   2. Crear un usuario directamente en MySQL');
      console.log('');
      console.log('   Ejemplo de creación directa en MySQL:');
      console.log('   INSERT INTO users (username, password_hash, full_name, email, role_id, is_active)');
      console.log("   VALUES ('testuser', '$2b$10$...', 'Usuario de Prueba', 'test@example.com', 2, 1);");
      console.log('');
      console.log('   O usar bcrypt para hashear la contraseña primero.');
    } else {
      console.log('✅ Usuarios disponibles para login:');
      console.log('');
      users.forEach((user, index) => {
        console.log(`${index + 1}. Username: ${user.username}`);
        console.log(`   Email: ${user.email || 'N/A'}`);
        console.log(`   Nombre: ${user.full_name || 'N/A'}`);
        console.log(`   Activo: ${user.is_active ? '✅' : '❌'}`);
        console.log('');
      });
      console.log('💡 Puedes usar cualquiera de estos usuarios para probar el login.');
      console.log('⚠️  Nota: Necesitarás la contraseña en texto plano para hacer login.');
      console.log('   Si no la conoces, deberás crear un nuevo usuario o resetear la contraseña.');
    }

    await db.closeConnection();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUsers();

