const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const GpaPorSemestre = sequelize.define(
    'GpaPorSemestre',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      gpa: {
        type: DataTypes.STRING
      }
    },
    {
      underscored: true,
      tableName: 'gpa_por_semestre',
      timestamps: false
    }
  );

  return GpaPorSemestre;
};
