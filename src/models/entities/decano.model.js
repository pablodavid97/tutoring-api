const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Decano = sequelize.define(
    'Decano',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      carrera: {
        type: DataTypes.STRING,
      },
      usuarioId: {
        type: DataTypes.INTEGER,
      }
    },
    {
      underscored: true,
      tableName: 'decano',
      timestamps: false
    }
  );

  return Decano;
};
