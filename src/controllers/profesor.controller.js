const database = require('../models/connection-manager');
const { logger } = require('../utils/logger');
const profesor = database.profesor;
const profesorController = {};

// SELECT *
profesorController.find = async () => {
  try {
    const prof = await profesor.findAll();
    return prof;
  } catch (error) {
    logger.error(error.message);
  }
};

profesorController.insertProfesor = async (userId, carrera) => {
  try {
    await profesor.create({
      id: userId,
      usuarioId: userId,
      carreraId: carrera
    }, {
      fields: ["id", "usuarioId", "carreraId"]
    });
  } catch (error) {
    logger.error(error.message);
  }
}

module.exports = profesorController;
