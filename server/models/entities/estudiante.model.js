const { Sequelize, DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    const Estudiante = sequelize.define('Estudiante', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        carrera: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gpa: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        periodo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        horario: {
            type: DataTypes.STRING
        },
        progreso: {
            type: DataTypes.STRING
        }
    }, {
        underscored: true,
        tableName: 'estudiante',
        timestamps: false,
    });

    return Estudiante;
}