const {DataTypes} = require('sequelize')
const { sequelize } = require('../connection-manager')

module.exports = (sequelize) => {
    const ReunionView = sequelize.define("ReunionView", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        tema: {
            type: DataTypes.STRING
        },
        descripcion: {
            type: DataTypes.STRING
        },
        fecha: {
            type: DataTypes.DATE
        },
        profesor_id: {
            type: DataTypes.INTEGER
        },
        nombresProfesor: {
            type: DataTypes.STRING
        },
        apellidosProfesor: {
            type: DataTypes.STRING
        },
        estudianteId: {
            type: DataTypes.INTEGER
        },
        nombresEstudiante: {
            type: DataTypes.STRING
        },
        apellidosEstudiante: {
            type: DataTypes.STRING
        },
        estadoId: {
            type: DataTypes.INTEGER
        },
        estado: {
            type: DataTypes.STRING
        }
    }, {
        underscored: true,
        tableName: 'reunion_view',
        timestamps: false,
    });

    return ReunionView;
}