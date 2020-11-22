require('dotenv').config();
const { databaseConfig } = require('../config/db.config');
const database = {};
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.user,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    dialect: databaseConfig.dialect,

    pool: {
      max: databaseConfig.pool.max,
      min: databaseConfig.pool.min,
      acquire: databaseConfig.pool.acquire,
      idle: databaseConfig.pool.idle
    }
  }
);

// ENTIDADES
database.sequelize = sequelize;
// database.Sequelize = Sequelize

database.usuario = require('./entities/usuario.model')(database.sequelize);
database.rol = require('./entities/rol.model')(database.sequelize);
database.estado = require('./entities/estado.model')(database.sequelize);
database.decano = require('./entities/decano.model')(database.sequelize);
database.profesor = require('./entities/profesor.model')(database.sequelize);
database.estudiante = require('./entities/estudiante.model')(
  database.sequelize
);
database.reunion = require('./entities/reunion.model')(
  database.sequelize
);

database.usuarioView = require('./entities/usuario-view.model')(
  database.sequelize
);
database.estudianteView = require('./entities/estudiante-view.model')(
  database.sequelize
);
database.profesorView = require('./entities/profesor-view.model')(
  database.sequelize
);
database.reunionView = require('./entities/reunion-view.model')(
  database.sequelize
);
database.notificacion = require('./entities/notificacion.model')(
  database.sequelize
);
database.notificacionView = require('./entities/notificacion-view.model')(
  database.sequelize
);
database.estadoNotificacion = require('./entities/estado-notificacion.model')(
  database.sequelize
);
database.carrera = require('./entities/carrera.model')(
  database.sequelize
);
database.semestre = require('./entities/semestre.model')(
  database.sequelize
);
database.gpaPorSemestre = require('./entities/gpa-por-semestre.model')(
  database.sequelize
);
database.gpaView = require('./entities/gpa-view.model')(
  database.sequelize
);
database.imagen = require('./entities/imagen.model')(database.sequelize)

// establece las relaciones entre las entidades

// relacion usuario-rol (muchos a uno)
database.rol.hasMany(database.usuario, { as: 'usuarios' });
database.usuario.belongsTo(database.rol, { as: 'rol' });

// relaciones uno a uno
database.usuario.hasMany(database.decano, { as: 'decano' });
database.decano.belongsTo(database.usuario, { as: 'usuario' });

database.usuario.hasMany(database.profesor, { as: 'profesor' });
database.profesor.belongsTo(database.usuario, { as: 'usuario' });

database.usuario.hasMany(database.estudiante, { as: 'estudiante' });
database.estudiante.belongsTo(database.usuario, { as: 'usuario' });

database.imagen.hasMany(database.usuario, { as: 'usuario'});
database.usuario.belongsTo(database.imagen, { as: 'imagen'});

// relacion profesor-estudiante
database.profesor.hasMany(database.estudiante, { as: 'estudiante' });
database.estudiante.belongsTo(database.profesor, { as: 'profesor' });

// relacion reunion-estado
database.estado.hasMany(database.reunion, { as: 'reunion' });
database.reunion.belongsTo(database.estado, { as: 'estado' });

// relacion reunion-profesor-estudiante
database.profesor.hasMany(database.reunion, { as: 'reunion' });
database.reunion.belongsTo(database.profesor, { as: 'profesor' });

database.estudiante.hasMany(database.reunion, { as: 'reunion' });
database.reunion.belongsTo(database.estudiante, { as: 'estudiante' });

// relacion muchos a muchos reunion-usuaro (notificacion)
database.usuario.hasMany(database.notificacion, { as: 'notificacion' });
database.notificacion.belongsTo(database.usuario, { as: 'usuario' });

database.reunion.hasMany(database.notificacion, { as: 'notificacion' });
database.notificacion.belongsTo(database.reunion, { as: 'reunion' });

// relacion notificacion - estadoNotificacion
database.estadoNotificacion.hasMany(database.notificacion, { as: 'notificacion'})
database.notificacion.belongsTo(database.estadoNotificacion, { as: 'estadoNotificacion'})

// relacion decano-carrera
database.carrera.hasMany(database.decano, {as: "decano"})
database.decano.belongsTo(database.carrera, {as: "carrera"})

// relacion estudiante-carrera
database.carrera.hasMany(database.estudiante, {as: "estudiante"})
database.estudiante.belongsTo(database.carrera, {as: "carrera"})

// relacion profesor-carrera
database.carrera.hasMany(database.profesor, {as: "profesor"})
database.profesor.belongsTo(database.carrera, {as: "carrera"})

// relacion muchos a muchos estudiante-semestre
database.estudiante.hasMany(database.gpaPorSemestre, {as: "gpaPorSemestre"})
database.gpaPorSemestre.belongsTo(database.estudiante, {as: "estudiante"})

database.semestre.hasMany(database.gpaPorSemestre, {as: "gpaPorSemestre"})
database.gpaPorSemestre.belongsTo(database.semestre, {as: "semestre"})

// CONNECTION
database.connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
  }
};

module.exports = database;
