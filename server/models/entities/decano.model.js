const { Sequelize, DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    const Decano = sequelize.define('Decano', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        carrera: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        underscored: true,
        tableName: 'decano',
        timestamps: false,
    });

    return Decano;
}