const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection-manager');

module.exports = (sequelize) => {
  const ReunionView = sequelize.define(
    'ReunionView',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
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
      estadoId: {
        type: DataTypes.INTEGER
      },
      estado: {
        type: DataTypes.STRING
      },
      semestreId: {
        type: DataTypes.INTEGER
      },
      semestre: {
        type: DataTypes.STRING
      },
      carreraId: {
        type: DataTypes.INTEGER
      },
      carrera: {
        type: DataTypes.STRING
      }
    },
    {
      underscored: true,
      tableName: 'reunion_view',
      timestamps: false
    }
  );

  return ReunionView;
};
