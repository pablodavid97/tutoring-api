const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RolesUsuarioView = sequelize.define(
    'RolesUsuarioView',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      rolId: {
          type: DataTypes.INTEGER
      },
      rol: {
          type: DataTypes.STRING
      },
      usuarioId: {
          type: DataTypes.INTEGER
      }
    },
    {
      underscored: true,
      tableName: 'roles_usuario_view',
      timestamps: false
    }
  );

  return RolesUsuarioView;
};
