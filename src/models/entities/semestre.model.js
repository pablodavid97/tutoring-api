const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Semestre = sequelize.define(
    'Semestre',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      semestre: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      underscored: true,
      tableName: 'semestre',
      timestamps: false
    }
  );

  return Semestre;
};