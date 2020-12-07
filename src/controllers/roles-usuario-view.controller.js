const database = require('../models/connection-manager');
const { logger } = require('../utils/logger');
const rolesUsuarioView = database.rolesUsuarioView;
const rolesUsuarioViewController = {};

rolesUsuarioViewController.getUserRoles = async (userId) => {
  try {
    userRoles = await rolesUsuarioView.findAll({
      where: {
        usuarioId: userId
      }
    });

    return userRoles;
  } catch (error) {
    logger.error(error.message);
  }
};

module.exports = rolesUsuarioViewController;
