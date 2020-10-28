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
database.usuario = require('./entities/usuario.model')(database.sequelize);
database.rol = require('./entities/rol.model')(database.sequelize);
// database.profesor = require('./entities/profesor.model')(database.sequelize);
// database.decano = require('./entities/decano.model')(database.sequelize);
// database.ereunion = require('./entities/estado_reunion.model')(database.sequelize);
// database.estudiante = require('./entities/estudiante.model')(database.sequelize);
// database.reunion = require('./entities/reunion.model')(database.sequelize);

database.usuario.belongsTo(database.rol);
database.rol.hasMany(database.usuario, {as: "usuarios"});

// database.estudiante.belongsTo(database.profesor);
// database.profesor.hasMany(database.estudiante, {as:"estudiante"});


// database.reunion.belongsTo(database.profesor);
// database.reunion.belongsTo(database.estudiante);
// database.reunion.belongsTo(database.ereunion);
// database.profesor.hasMany(database.reunion, {as: "prof"});
// database.estudiante.hasMany(database.reunion, {as: "estudiante"});
// database.ereunion.hasMany(database.reunion, {as: "ereunion"});

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