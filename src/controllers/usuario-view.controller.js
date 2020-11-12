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
    console.log("email: ", email);

    try {
      user = await usuarioView.findAll({
        where: {
          correoInstitucional: email
        }
      });

      console.log("User: ", user)
  
      return user[0];
    } catch (error) {
      logger.error(error.message);
    }
  };

module.exports = usuarioViewController;

