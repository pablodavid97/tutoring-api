const { logger } = require('../utils/logger');
const database = require('../models/connection-manager');
const profesorView = database.profesorView;
const profesorViewController = {};

profesorViewController.getProfesores = async () => {
  try {
    profesores = await profesorView.findAll();

    return profesores;
  } catch (error) {
    logger.error(error.message);
  }
};

module.exports = profesorViewController;
