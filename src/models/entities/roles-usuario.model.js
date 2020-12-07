const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RolesUsuario = sequelize.define(
    'RolesUsuario',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
    },
    {
      underscored: true,
      tableName: 'roles_de_usuario',
      timestamps: false
    }
  );

  return RolesUsuario;
};
