const bcrypt = require('bcrypt');

async function generarHash() {
  const usuarios = [
    { username: 'admin', password: 'Admin123!' },
    { username: 'soporte1', password: 'Soporte123!' },
    { username: 'tecnico1', password: 'Tecnico123!' }
  ];

  console.log('\n' + '='.repeat(70));
  console.log('HASHES GENERADOS - Copia y pega en SQL');
  console.log('='.repeat(70) + '\n');

  for (const user of usuarios) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    
    console.log(`-- Usuario: ${user.username}`);
    console.log(`-- Contraseña: ${user.password}`);
    console.log(`UPDATE users SET password_hash = '${hash}' WHERE username = '${user.username}';\n`);
  }
  
  console.log('='.repeat(70));
}

generarHash();