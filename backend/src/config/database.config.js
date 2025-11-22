require('dotenv').config();

// Función helper para manejar contraseñas vacías
const getPassword = () => {
  const pwd = process.env.DB_PASSWORD;
  // Si no está definido o es una cadena vacía/espacios, retorna null (sin contraseña)
  if (!pwd || pwd.trim() === '') {
    return null;
  }
  return pwd;
};

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: getPassword(),
    database: process.env.DB_DATABASE || 'isp_management_system',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '-05:00'
  },
  
  test: {
    username: process.env.DB_USERNAME || 'root',
    password: getPassword(),
    database: process.env.DB_DATABASE_TEST || 'isp_management_system_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '-05:00'
  },
  
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    },
    timezone: '-05:00',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
};
