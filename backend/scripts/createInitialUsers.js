const bcrypt = require('bcrypt');

async function generateUsers() {
  const usuarios = [
    { username: 'admin', password: 'Admin123!', role: 'admin' },
    { username: 'tecnico1', password: 'Tecnico123!', role: 'tecnico' },
    { username: 'contador1', password: 'Contador123!', role: 'contador' }
  ];

  console.log('\n' + '='.repeat(80));
  console.log('USUARIOS INICIALES - Ejecuta estos SQL en tu base de datos');
  console.log('='.repeat(80) + '\n');

  for (const user of usuarios) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    
    const roleMap = { 'admin': 1, 'tecnico': 2, 'contador': 3 };
    const roleId = roleMap[user.role];
    
    console.log(`-- Usuario: ${user.username} (${user.role})`);
    console.log(`-- Contraseña: ${user.password}`);
    console.log(`INSERT INTO users (username, password_hash, full_name, email, phone, role_id, role, is_active, is_verified, created_at, updated_at)
VALUES ('${user.username}', '${hash}', '${user.username.charAt(0).toUpperCase() + user.username.slice(1)}', '${user.username}@ispsystem.local', '3001234567', ${roleId}, '${user.role}', 1, 1, NOW(), NOW());\n`);
  }
  
  console.log('='.repeat(80));
  console.log('Después de ejecutar los SQL, reinicia el backend y prueba el login');
  console.log('='.repeat(80) + '\n');
}

generateUsers();