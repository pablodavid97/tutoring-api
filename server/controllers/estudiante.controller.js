const database = require('../models/connection-manager')
const estudiante = database.estudiante
const estudianteController = {}

estudianteController.getEstudianteById = async (estudianteId) => {
    try {
        const row = await estudiante.findByPk(estudianteId)

        console.log("Estudiante: ", row);

        return row;
    } catch (error) {
        logger.error(error.message);
    }
}


module.exports = estudianteController