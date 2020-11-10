const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Rol = sequelize.define(
    'Rol',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      underscored: true,
      tableName: 'rol',
      timestamps: false
    }
  );

  return Rol;
};
