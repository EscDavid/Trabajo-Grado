const { Sequelize } = require('sequelize');
const config = require('../../config/database.config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port || 3306,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging !== undefined ? dbConfig.logging : console.log,
    pool: dbConfig.pool || {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true
    }
  }
);

const db = {};

// Solo modelos necesarios
db.User = require('./User.model')(sequelize);
db.Role = require('./Role.model')(sequelize);
db.UserSession = require('./UserSession.model')(sequelize);
db.RefreshToken = require('./RefreshToken.model')(sequelize);
db.Customer = require('./Customer.model')(sequelize);

// Ejecutar asociaciones
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.sync = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ Base de datos sincronizada correctamente');
  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos:', error);
    throw error;
  }
};

db.testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
    return false;
  }
};

db.closeConnection = async () => {
  try {
    await sequelize.close();
    console.log('✅ Conexión a la base de datos cerrada correctamente');
  } catch (error) {
    console.error('❌ Error al cerrar la conexión:', error);
  }
};

module.exports = db;