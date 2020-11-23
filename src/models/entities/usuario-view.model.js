const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UsuarioView = sequelize.define(
    'UsuarioView',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      codigo: {
        type: DataTypes.STRING
      },
      correoInstitucional: {
        type: DataTypes.STRING,
        allowNull: false
      },
      hash: {
        type: DataTypes.STRING
      },
      nombres: {
        type: DataTypes.STRING,
        allowNull: false
      },
      apellidos: {
        type: DataTypes.STRING
      },
      correoPersonal: {
        type: DataTypes.STRING,
        allowNull: false
      },
      telefono: {
        type: DataTypes.STRING
      },
      firstTimeLogin: {
        type: DataTypes.TINYINT,
        allowNull: false
      },
      imagenId: {
          type: DataTypes.INTEGER
      },
      formatoImagen: {
          type: DataTypes.STRING
      },
      nombreImagen: {
          type: DataTypes.STRING
      },
      imagen: {
          type: DataTypes.BLOB("long")
      }
    },
    {
      underscored: true,
      tableName: 'usuario_view',
      timestamps: false
    }
  );

  return UsuarioView;
};
