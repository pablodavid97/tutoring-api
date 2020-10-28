const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    const Profesor = sequelize.define('Profesor', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        carrera: {
            type: DataTypes.STRING
        }
    },{
        underscored: true,
        tableName: 'profesor',
        timestamps: false,
    });

    return Profesor
}