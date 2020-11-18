const database = require('../models/connection-manager');
const estado = database.estado;
const estadoController = {};

estadoController.find = async () => {
  try {
    const status = await estado.findAll();
    return status;
  } catch (error) {
    console.error(error.message);
  }
};
module.exports = estadoController;
