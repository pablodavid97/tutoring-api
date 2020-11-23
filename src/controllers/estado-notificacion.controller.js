const database = require('../models/connection-manager');
const estadoNotificacion = database.estadoNotificacion;
const estadoNotificacionController = {};

estadoNotificacionController.find = async () => {
  try {
    const status = await estadoNotificacion.findAll();
    return status;
  } catch (error) {
    console.error(error.message);
  }
};
module.exports = estadoNotificacionController;
