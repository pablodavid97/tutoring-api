const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EstudianteView = sequelize.define(
    'EstudianteView',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      codigo: {
        type: DataTypes.STRING
      },
      correoInstitucional: {
        type: DataTypes.STRING
      },
      hash: {
        type: DataTypes.STRING
      },
      nombres: {
        type: DataTypes.STRING
      },
      apellidos: {
        type: DataTypes.STRING
      },
      correoPersonal: {
        type: DataTypes.STRING
      },
      telefono: {
        type: DataTypes.STRING
      },
      carrera: {
        type: DataTypes.STRING
      },
      gpa: {
        type: DataTypes.FLOAT
      },
      status: {
        type: DataTypes.STRING
      },
      periodoDeAdmision: {
        type: DataTypes.STRING
      },
      tipoDeAdmision: {
        type: DataTypes.STRING
      },
      profesorId: {
        type: DataTypes.INTEGER
      }
    },
    {
      underscored: true,
      tableName: 'estudiante_view',
      timestamps: false
    }
  );

  return EstudianteView;
};
