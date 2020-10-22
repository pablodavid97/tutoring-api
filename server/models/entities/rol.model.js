const { Sequelize, DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    const Rol = sequelize.define('Rol', {
        rolId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING
        }
    }, {
        underscored: true,
        tableName: 'rol',
        timestamps: false,
    });

    return Rol;
}