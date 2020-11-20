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
      carreraId: {
        type: DataTypes.INTEGER
      },
      carrera: {
        type: DataTypes.STRING
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
      },
      imagenId: {
        type: DataTypes.INTEGER
      },
      formatoImagen: {
          type: DataTypes.STRING
      },
      nombreImagen: {
          type: DataTypes.STRING
      },
      imagen: {
          type: DataTypes.BLOB("long")
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
