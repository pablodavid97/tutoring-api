const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    const Estudiante = sequelize.define('Estudiante', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        carrera: {
            type: DataTypes.STRING,
        }, 
        gpa: {
            type: DataTypes.FLOAT
        },
        status: {
            type: DataTypes.STRING
        },
        periodoDeAdmision: {
            type: DataTypes.STRING
        },
        tipoDeAdmision: {
            type: DataTypes.STRING
        },
        horario: {
            type: DataTypes.STRING
        },
        progresoDeCarrera: {
            type: DataTypes.STRING
        }
    }, {
        underscored: true,
        tableName: 'estudiante',
        timestamps: false,
    });

    return Estudiante
}