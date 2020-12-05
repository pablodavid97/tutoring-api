const database = require('../models/connection-manager');
const { logger } = require('../utils/logger');
const carrera = database.carrera;
const carreraController = {};

carreraController.getAllCarreras = async () => {
  try {
    const carreras = await carrera.findAll();
    return carreras;
  } catch (error) {
    logger.error(error.message);
  }
};

carreraController.insertCarrera = async (id, carreraItem) => {
  try {
    await carrera.create({
      id: id,
      carrera: carreraItem
    }, {
      fields: ["id", "carrera"]
    })
  } catch(error) {
    logger.error(error.message)
  }
}

// Truncates table
carreraController.clearTable = async () => {
  try {
    console.log("BReak point");
    await carrera.destroy({
      where: {}
    })
  } catch (error) {
    logger.error(error.message)
  }
}

module.exports = carreraController;
