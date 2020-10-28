const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    const ProfesorView = sequelize.define("ProfesorView", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        codigo: {
            type: DataTypes.STRING
        },
        nombres: {
            type: DataTypes.STRING
        },
        apellidos: {
            type: DataTypes.STRING
        },
        hash: {
            type: DataTypes.STRING
        },
        carrera: {
            type: DataTypes.STRING
        },
        correoInstitucional: {
            type: DataTypes.STRING
        },
        correoPersonal: {
            type: DataTypes.STRING
        },
        telefono: {
            type: DataTypes.STRING
        }

    }, {
        underscored: true,
        tableName: 'profesor_view',
        timestamps: false,
    });

    return ProfesorView;
}