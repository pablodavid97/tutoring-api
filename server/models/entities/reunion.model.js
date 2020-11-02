const { Sequelize, DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    const Reunion = sequelize.define('Reunion', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        tema: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false
        },
        comentarios_estudiante: {
            type: DataTypes.STRING
        },
        comentarios_profesor: {
            type: DataTypes.STRING
        },
        semestre: {
            type: DataTypes.STRING
        },
        createdOn: {
            type: DataTypes.DATE
        },
        createdBy: {
            type: DataTypes.STRING
        },
        updatedOn: {
            type: DataTypes.DATE
        },
        updatedBy: {
            type: DataTypes.STRING
        }
    }, {
        underscored: true,
        tableName: 'reunion',
        timestamps: false,
    });

    return Reunion;
}