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
database.estudiante = require('./entities/estudiante.model')(database.sequelize);
database.profesor = require('./entities/profesor.model')(database.sequelize);
database.estudianteView = require('./entities/estudiante-view.model')(database.sequelize);
database.profesorView = require('./entities/profesor-view.model')(database.sequelize);
database.reunionView = require('./entities/reunion-view.model')(database.sequelize);

// establece las relaciones entre las entidades

// relacion usuario-rol (muchos a uno)
database.usuario.belongsTo(database.rol);
database.rol.hasMany(database.usuario, {as: "usuarios"});

// relaciones uno a uno
database.usuario.hasOne(database.estudiante);
database.estudiante.belongsTo(database.usuario)

database.usuario.hasOne(database.profesor);
database.profesor.belongsTo(database.usuario);

// relacion estudiante-profesor (muchos a uno)
database.estudiante.belongsTo(database.profesor);
database.profesor.hasMany(database.estudiante, {as: "estudiantes"});


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
