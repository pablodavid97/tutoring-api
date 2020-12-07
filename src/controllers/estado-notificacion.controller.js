const database = require('../models/connection-manager');
const { logger } = require('../utils/logger');
const estadoNotificacion = database.estadoNotificacion;
const estadoNotificacionController = {};

estadoNotificacionController.find = async () => {
  try {
    const status = await estadoNotificacion.findAll();
    return status;
  } catch (error) {
    logger.error(error.message);
  }
};

estadoNotificacionController.insertEstado = async (estadoItem) => {
  try {
    await estadoNotificacion.create(
      {
        id: estadoItem.id,
        estado: estadoItem.estado
      },
      {
        fields: ['id', 'estado']
      }
    );
  } catch (error) {
    logger.error(error.message);
  }
};

// Truncates table
estadoNotificacionController.clearTable = async () => {
  try {
    await estadoNotificacion.destroy({
      where: {}
    });
  } catch (error) {
    logger.error(error.message);
  }
};

module.exports = estadoNotificacionController;
