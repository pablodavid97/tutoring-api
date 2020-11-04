const database = require('../models/connection-manager');
const notificacion = database.notificacion;
const notificacionController = {};
const { logger } = require('../utils/logger');

notificacionController.createNotificacion = async (reunionId, usuarioId) => {
    try {
        userNotification = await notificacion.create(
            {
                reunionId: reunionId,
                usuarioId: usuarioId,
              },
              {
                fields: [
                  'reunionId',
                  'usuarioId',
                ]
              }
        );
        console.log("User notification: ", userNotification);

        return userNotification
    } catch (error) {
        logger.error(error.message)
    }
}

notificacionController.deleteNotificacion = async (notificationId) => {
  try {
    await notificacion.destroy({
      where: {
        id: notificationId
      }
    })
  } catch (error) {
    logger.error(error.message)
  }
}

module.exports = notificacionController;
