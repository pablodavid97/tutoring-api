const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Estado = sequelize.define(
    'Estado',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      estado: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      underscored: true,
      tableName: 'estado_reunion',
      timestamps: false
    }
  );

  return Estado;
};
