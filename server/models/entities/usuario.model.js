const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Usuario = sequelize.define(
    'Usuario',
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
      }
    },
    {
      underscored: true,
      tableName: 'usuario',
      timestamps: false
    }
  );

  return Usuario;
};
