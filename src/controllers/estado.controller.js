const database = require('../models/connection-manager');
const { logger } = require('../utils/logger');
const estado = database.estado;
const estadoController = {};

estadoController.find = async () => {
  try {
    const status = await estado.findAll();
    return status;
  } catch (error) {
    logger.error(error.message);
  }
};

estadoController.insertEstado = async (estadoItem) => {
  try {
    await estado.create({
      id: estadoItem.id,
      estado: estadoItem.estado
    }, {
      fields: ["id", "estado"]
    })
  } catch(error) {
    logger.error(error.message)
  }
}

// Truncates table
estadoController.clearTable = async () => {
  try {
    await estado.destroy({
      where: {}
    })
  } catch (error) {
    logger.error(error.message)
  }
}

module.exports = estadoController;
