const { logger } = require('../utils/logger');
const database = require('../models/connection-manager')
const estudianteView = database.estudianteView
const estudianteViewController = {}

estudianteViewController.getEstudiantes = async () => {
    try {
        estudiantes = await estudianteView.findAll()

        return estudiantes;

    } catch (error) {
        logger.error(error.message);
    }
}

estudianteViewController.getEstudianteById = async (usuarioId) => {
    try {
        estudiante = await estudianteView.findByPk(usuarioId)

        return estudiante;
    } catch (error) {
        logger.error(error.message);
    }
}

estudianteViewController.getEstudiantesByProfesorId = async (profesorId) => {
    try {
        estudiantes = await estudianteView.findAll({
            where: {
                profesorId: profesorId
            }
        });

        return estudiantes;
    } catch (error) {
        logger.error(error.message);
    }
}

module.exports = estudianteViewController