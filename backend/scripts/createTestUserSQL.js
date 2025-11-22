require('dotenv').config();
const db = require('../src/database/models');
const bcrypt = require('bcrypt');

async function createTestUser() {
  try {
    console.log('='.repeat(60));
    console.log('👤 Creando usuario de prueba...');
    console.log('='.repeat(60));
    console.log('');

    // Conectar a la base de datos
    await db.testConnection();

    // Verificar si ya existe
    const [existingUsers] = await db.sequelize.query(`
      SELECT id, username FROM users WHERE username = 'testuser'
    `);

    if (existingUsers.length > 0) {
      console.log('⚠️  El usuario "testuser" ya existe.');
      console.log('');
      await db.closeConnection();
      process.exit(1);
    }

    // Hashear la contraseña
    const password = 'Test1234';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear usuario usando SQL directo (usando la estructura real de la tabla)
    await db.sequelize.query(`
      INSERT INTO users (username, password_hash, full_name, email, role, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, {
      replacements: [
        'testuser',
        passwordHash,
        'Usuario de Prueba',
        'test@example.com',
        'admin',  // role: 'admin','technical_support','billing','sales'
        true
      ]
    });

    console.log('✅ Usuario de prueba creado exitosamente!');
    console.log('');
    console.log('📝 Credenciales de acceso:');
    console.log('   Username: testuser');
    console.log('   Password: Test1234');
    console.log('   Email: test@example.com');
    console.log('');
    console.log('💡 Puedes usar estas credenciales para probar el login.');
    console.log('');

    await db.closeConnection();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.original) {
      console.error('   Detalles:', error.original.message);
    }
    process.exit(1);
  }
}

createTestUser();

