require('dotenv').config();
const {databaseConfig} = require('./db.config')
const database = {}
const Sequelize = require('sequelize');

const sequelize = new Sequelize(databaseConfig.database, databaseConfig.user, databaseConfig.password, {
    host: databaseConfig.host,
    dialect: databaseConfig.dialect,

    pool: {
      max: databaseConfig.pool.max,
      min: databaseConfig.pool.min,
      acquire: databaseConfig.pool.acquire,
      idle: databaseConfig.pool.idle
    }
});

// ENTIDADES
database.sequelize = sequelize
// database.Sequelize = Sequelize

database.usuario = require('./entities/usuario.model')(database.sequelize);
database.rol = require('./entities/rol.model')(database.sequelize);

database.usuario.belongsTo(database.rol);
database.rol.hasMany(database.usuario, {as: "usuarios"});

// CONNECTION
database.connect = async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } 
    catch (error) {
      console.error('Unable to connect to the database:', error.message);
    }
}

module.exports = database;
