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
        estadoNotificacionId: 1
      },
      {
        fields: ['reunionId', 'usuarioId', 'estadoNotificacionId']
      }
    );

    return userNotification;
  } catch (error) {
    logger.error(error.message);
  }
};

notificacionController.deleteNotificacion = async (notificationId) => {
  try {
    await notificacion.destroy({
      where: {
        id: notificationId
      }
    });
  } catch (error) {
    logger.error(error.message);
  }
};

notificacionController.deleteAllNotificationsByMeetingId = async (
  meetingId
) => {
  try {
    await notificacion.destroy({
      where: {
        reunionId: meetingId
      }
    });
  } catch (error) {
    logger.error(error.message);
  }
};

notificacionController.updateNotificationStatus = async (
  status,
  notificationid
) => {
  try {
    await notificacion.update(
      { estadoNotificacionId: status },
      {
        where: {
          id: notificationid
        }
      }
    );
  } catch (error) {
    logger.error(error.message);
  }
};

notificacionController.getNotificationByMeetingId = async (meetingId) => {
  try {
    notification = await notificacion.findAll({
      where: {
        reunionId: meetingId
      }
    });

    return notification[0];
  } catch (error) {
    logger.error(error.message);
  }
};

module.exports = notificacionController;
