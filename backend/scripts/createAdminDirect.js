require('dotenv').config();
const db = require('../src/database/models');
const { User, Role } = db;

async function createAdmin() {
  try {
    console.log('='.repeat(60));
    console.log('🔧 Creando usuario administrador...');
    console.log('='.repeat(60));

    // Verificar conexión a la base de datos
    const connected = await db.testConnection();
    if (!connected) {
      console.error('❌ No se pudo conectar a la base de datos');
      process.exit(1);
    }

    // Verificar que exista el rol admin
    const adminRole = await Role.findOne({ where: { id: 1 } });
    if (!adminRole) {
      console.log('⚠️  El rol admin no existe. Creándolo...');
      await Role.create({
        id: 1,
        name: 'ADMIN',
        description: 'Administrador del sistema',
        permissions: JSON.stringify(['*'])
      });
      console.log('✅ Rol admin creado');
    }

    // Crear o actualizar usuario admin
    const adminUsers = ['admin', 'superadmin'];
    
    for (const username of adminUsers) {
      const existingUser = await User.findOne({ where: { username } });
      
      if (existingUser) {
        console.log(`⚠️  El usuario ${username} ya existe. Actualizando...`);
        
        // Actualizar el usuario existente
        existingUser.passwordHash = '123456'; // El hook lo hasheará automáticamente
        existingUser.fullName = 'Administrador Sistema';
        existingUser.email = username === 'admin' ? 'admin@dabang.com' : 'superadmin@dabang.com';
        existingUser.phone = '3001234567';
        existingUser.roleId = 1;
        existingUser.role = 'admin';
        existingUser.isActive = true;
        existingUser.isVerified = true;
        existingUser.failedLoginAttempts = 0;
        existingUser.lockedUntil = null;
        
        await existingUser.save();
        console.log(`✅ Usuario ${username} actualizado exitosamente`);
      } else {
        console.log(`📝 Creando nuevo usuario ${username}...`);
        
        // Crear el usuario (el hook hasheará la contraseña automáticamente)
        const newUser = await User.create({
          username,
          passwordHash: '123456', // El hook lo hasheará
          fullName: 'Administrador Sistema',
          email: username === 'admin' ? 'admin@dabang.com' : 'superadmin@dabang.com',
          phone: '3001234567',
          roleId: 1,
          role: 'admin',
          isActive: true,
          isVerified: true,
          failedLoginAttempts: 0
        });
        
        console.log(`✅ Usuario ${username} creado exitosamente`);
        console.log('   ID:', newUser.id);
      }
    }

    // Verificar que los usuarios se pueden encontrar y la contraseña funciona
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ VERIFICACIÓN DE USUARIOS');
    console.log('='.repeat(60));
    
    for (const username of adminUsers) {
      const testUser = await User.findOne({ where: { username } });
      if (testUser) {
        const passwordTest = await testUser.comparePassword('123456');
        console.log(`Usuario: ${username}`);
        console.log('Contraseña: 123456');
        console.log('Prueba de contraseña:', passwordTest ? '✅ CORRECTA' : '❌ INCORRECTA');
        console.log('Usuario activo:', testUser.isActive ? '✅ SÍ' : '❌ NO');
        console.log('Usuario verificado:', testUser.isVerified ? '✅ SÍ' : '❌ NO');
        console.log('Intentos fallidos:', testUser.failedLoginAttempts);
        console.log('Bloqueado hasta:', testUser.lockedUntil || 'No bloqueado');
        console.log('');
      }
    }
    console.log('='.repeat(60));

    await db.closeConnection();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear usuario admin:', error);
    console.error(error.stack);
    await db.closeConnection();
    process.exit(1);
  }
}

createAdmin();

