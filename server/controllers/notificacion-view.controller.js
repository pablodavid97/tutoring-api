const database = require('../models/connection-manager');
const notificacionView = database.notificacionView;
const notificacionViewController = {};
const { logger } = require('../utils/logger');


notificacionViewController.getNotificationsByUserId = async (userId) => {
    try {
        notifications = notificacionView.findAll({
            where: {
                estudianteId: userId
            }
        });

        return notifications
    } catch (error) {
        logger.error(error.message)
    }
}

module.exports = notificacionViewController;
