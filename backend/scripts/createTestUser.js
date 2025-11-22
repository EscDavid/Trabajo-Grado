require('dotenv').config();
const db = require('../src/database/models');

async function createTestUser() {
  try {
    console.log('='.repeat(60));
    console.log('👤 Creando usuario de prueba...');
    console.log('='.repeat(60));
    console.log('');

    // Conectar a la base de datos
    await db.testConnection();

    // Verificar si ya existe
    const existingUser = await db.User.findOne({
      where: { username: 'testuser' }
    });

    if (existingUser) {
      console.log('⚠️  El usuario "testuser" ya existe.');
      console.log('');
      console.log('💡 Opciones:');
      console.log('   1. Usar otro username');
      console.log('   2. Eliminar el usuario existente y crear uno nuevo');
      console.log('');
      await db.closeConnection();
      process.exit(1);
    }

    // Crear usuario de prueba
    const testUser = await db.User.create({
      username: 'testuser',
      passwordHash: 'Test1234', // Se hasheará automáticamente
      fullName: 'Usuario de Prueba',
      email: 'test@example.com',
      roleId: 2, // ADMIN
      isActive: true,
      isVerified: true
    });

    console.log('✅ Usuario de prueba creado exitosamente!');
    console.log('');
    console.log('📝 Credenciales de acceso:');
    console.log(`   Username: ${testUser.username}`);
    console.log('   Password: Test1234');
    console.log(`   Email: ${testUser.email}`);
    console.log('');
    console.log('💡 Puedes usar estas credenciales para probar el login.');
    console.log('');

    await db.closeConnection();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.errors) {
      error.errors.forEach(err => {
        console.error(`   - ${err.message}`);
      });
    }
    process.exit(1);
  }
}

createTestUser();







