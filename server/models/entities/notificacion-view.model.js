const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NotificacionView = sequelize.define(
    'NotificacionView',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      usuarioId: {
          type: DataTypes.INTEGER
      },
      codigo: {
          type: DataTypes.STRING
      },
      correoInstitucional: {
          type: DataTypes.STRING
      },
      estudianteId: {
          type: DataTypes.INTEGER
      },
      nombresEstudiante: {
          type: DataTypes.STRING
      },
      apellidosEstudiante: {
          type: DataTypes.STRING
      },
      comentariosEstudiante: {
          type: DataTypes.STRING
      },
      profesorId: {
          type: DataTypes.INTEGER
      },
      nombresProfesor: {
          type: DataTypes.STRING
      },
      apellidosProfesor: {
          type: DataTypes.STRING
      },
      comentariosProfesor: {
          type: DataTypes.STRING
      },
      reunionId: {
          type: DataTypes.INTEGER
      },
      tema: {
          type: DataTypes.STRING
      },
      descripcion: {
          type: DataTypes.STRING
      },
      fecha: {
          type: DataTypes.DATE
      },
      estadoId: {
          type: DataTypes.INTEGER
      },
      estado: {
          type: DataTypes.STRING
      }
    },
    {
      underscored: true,
      tableName: 'notificacion_view',
      timestamps: false
    }
  );

  return NotificacionView;
};