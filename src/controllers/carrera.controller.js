const database = require('../models/connection-manager');
const carrera = database.carrera;
const carreraController = {};

carreraController.getAllCarreras = async () => {
  try {
    const carreras = await carrera.findAll();
    return carreras;
  } catch (error) {
    console.error(error.message);
  }
};
module.exports = carreraController;