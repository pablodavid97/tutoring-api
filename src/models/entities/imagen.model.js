const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Imagen = sequelize.define(
    'Imagen',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      formato: {
          type: DataTypes.STRING
      },
      nombre: {
          type: DataTypes.STRING
      },
      datos: {
          type: DataTypes.BLOB('long')
      },
      uploadedOn: {
          type: DataTypes.DATE
      }
    },
    {
      underscored: true,
      tableName: 'imagen',
      timestamps: false
    }
  );

  return Imagen;
};
