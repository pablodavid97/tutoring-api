const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Profesor = sequelize.define(
    'Profesor',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      }
    },
    {
      underscored: true,
      tableName: 'profesor',
      timestamps: false
    }
  );

  return Profesor;
};
