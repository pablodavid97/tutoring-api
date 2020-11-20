const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Carrera = sequelize.define(
    'Carrera',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      carrera: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      underscored: true,
      tableName: 'carrera',
      timestamps: false
    }
  );

  return Carrera;
};