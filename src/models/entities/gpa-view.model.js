const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const GpaView = sequelize.define(
    'GpaView',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      semestreId: {
          type: DataTypes.INTEGER
      },
      semestre: {
          type: DataTypes.STRING
      },
      estudianteId: {
          type: DataTypes.INTEGER
      },
      gpa: {
          type: DataTypes.STRING
      }
    },
    {
      underscored: true,
      tableName: 'gpa_view',
      timestamps: false
    }
  );

  return GpaView;
};
