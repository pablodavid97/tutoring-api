const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EstadoNotificacion = sequelize.define(
    'EstadoNotificacion',
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
      tableName: 'estado_notificacion',
      timestamps: false
    }
  );

  return EstadoNotificacion;
};
