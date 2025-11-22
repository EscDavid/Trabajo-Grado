require('dotenv').config();
const db = require('../src/database/models');
const { User } = db;
const bcrypt = require('bcrypt');

async function fixUserPasswords() {
  try {
    console.log('='.repeat(60));
    console.log('🔧 Corrigiendo contraseñas de usuarios...');
    console.log('='.repeat(60));

    // Verificar conexión a la base de datos
    const connected = await db.testConnection();
    if (!connected) {
      console.error('❌ No se pudo conectar a la base de datos');
      process.exit(1);
    }

    // Usuarios a crear/actualizar
    const usersToFix = [
      {
        username: 'superadmin',
        password: '123456',
        fullName: 'Super Administrador',
        email: 'superadmin@dabang.com',
        phone: '3001234567',
        roleId: 1,
        role: 'admin'
      },
      {
        username: 'admin',
        password: '123456',
        fullName: 'Administrador Sistema',
        email: 'admin@dabang.com',
        phone: '3001234567',
        roleId: 1,
        role: 'admin'
      }
    ];

    for (const userData of usersToFix) {
      const existingUser = await User.findOne({ where: { username: userData.username } });
      
      if (existingUser) {
        console.log(`\n⚠️  Usuario ${userData.username} ya existe. Actualizando contraseña...`);
        
        // Hashear la contraseña manualmente para asegurar que se guarde correctamente
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        // Actualizar usando update directo para forzar el cambio
        await User.update(
          {
            passwordHash: hashedPassword,
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            roleId: userData.roleId,
            role: userData.role,
            isActive: true,
            isVerified: true,
            failedLoginAttempts: 0,
            lockedUntil: null
          },
          {
            where: { username: userData.username }
          }
        );
        
        console.log(`✅ Usuario ${userData.username} actualizado`);
      } else {
        console.log(`\n📝 Creando nuevo usuario ${userData.username}...`);
        
        // Hashear la contraseña antes de crear
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        const newUser = await User.create({
          username: userData.username,
          passwordHash: hashedPassword,
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          roleId: userData.roleId,
          role: userData.role,
          isActive: true,
          isVerified: true,
          failedLoginAttempts: 0
        });
        
        console.log(`✅ Usuario ${userData.username} creado exitosamente`);
        console.log('   ID:', newUser.id);
      }
    }

    // Verificar que las contraseñas funcionan
    console.log('\n' + '='.repeat(60));
    console.log('✅ VERIFICACIÓN DE CONTRASEÑAS');
    console.log('='.repeat(60));
    
    for (const userData of usersToFix) {
      const testUser = await User.findOne({ where: { username: userData.username } });
      if (testUser) {
        const passwordTest = await testUser.comparePassword(userData.password);
        console.log(`\nUsuario: ${userData.username}`);
        console.log('Contraseña: ' + userData.password);
        console.log('Prueba de contraseña:', passwordTest ? '✅ CORRECTA' : '❌ INCORRECTA');
        console.log('Password hash:', testUser.passwordHash ? testUser.passwordHash.substring(0, 30) + '...' : 'NULL');
        console.log('Usuario activo:', testUser.isActive ? '✅ SÍ' : '❌ NO');
        console.log('Usuario verificado:', testUser.isVerified ? '✅ SÍ' : '❌ NO');
        console.log('Intentos fallidos:', testUser.failedLoginAttempts);
        console.log('Bloqueado hasta:', testUser.lockedUntil || 'No bloqueado');
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ PROCESO COMPLETADO');
    console.log('='.repeat(60));
    console.log('\n💡 Ahora puedes iniciar sesión con:');
    console.log('   Usuario: superadmin');
    console.log('   Contraseña: 123456');
    console.log('');

    await db.closeConnection();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    console.error(error.stack);
    await db.closeConnection();
    process.exit(1);
  }
}

fixUserPasswords();

