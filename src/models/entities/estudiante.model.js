const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Estudiante = sequelize.define(
    'Estudiante',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      status: {
        type: DataTypes.STRING
      },
      periodoDeAdmision: {
        type: DataTypes.STRING
      },
      tipoDeAdmision: {
        type: DataTypes.STRING,
        allowNull: false
      },
      horario: {
        type: DataTypes.STRING
      },
      progresoDeCarrera: {
        type: DataTypes.STRING
      }
    },
    {
      underscored: true,
      tableName: 'estudiante',
      timestamps: false
    }
  );

  return Estudiante;
};
