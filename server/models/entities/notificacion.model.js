const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notificacion = sequelize.define(
    'Notificacion',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
    },
    {
      underscored: true,
      tableName: 'notificacion',
      timestamps: false
    }
  );

  return Notificacion;
};