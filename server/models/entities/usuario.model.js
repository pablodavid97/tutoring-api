const { Sequelize, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    const Usuario = sequelize.define('Usuario', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        codigo: {
            type: DataTypes.STRING,
        },
        correoInstitucional: {
            type: DataTypes.STRING
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
           type: DataTypes.STRING 
        },
        telefono: {
            type: DataTypes.STRING
        },
        firstTimeLogin: {
            type: DataTypes.TINYINT
        },
    }, {
        underscored: true,
        tableName: 'usuario',
        timestamps: false,
    });

    return Usuario
}