const { logger } = require('../utils/logger');
const database = require('../models/connection-manager');
const usuarioView = database.usuarioView;
const usuarioViewController = {};

// FIND BY ID
usuarioViewController.getUserById = async (userId) => {
  try {
    const rows = await usuarioView.findByPk(userId);

    return rows;
  } catch (error) {
    logger.error(error.message);
  }
};

// FIND BY FIELD
usuarioViewController.getUserByEmail = async (email) => {
  try {
    user = await usuarioView.findAll({
      where: {
        correoInstitucional: email
      }
    });

    return user[0];
  } catch (error) {
    logger.error(error.message);
  }
};

usuarioViewController.getAllUsuarios = async () => {
  try {
    users = await usuarioView.findAll();

    return users;
  } catch (error) {
    logger.error(error.message);
  }
};

usuarioViewController.getLastUserId = async () => {
  try {
    lastUser = await usuarioView.findOne({
      order: [['id', 'DESC']]
    });

    lastUserId = 0

    if(lastUser) {
      lastUserId = lastUser.id
    }

    return lastUserId

  } catch (error) {
    logger.error(error.message)
  }
}

module.exports = usuarioViewController;
