const { logger } = require('../utils/logger');
const { Sequelize } = require('sequelize');
const database = require('../models/connection-manager');
const reunionView = database.reunionView;
const reunionViewController = {};

reunionViewController.getReunionesByProfessor = async (userId) => {
  try {
    reuniones = await reunionView.findAll({
      where: {
        profesorId: userId,
        estadoId: {
          [Sequelize.Op.not]: 5
        }
      }
    });

    return reuniones;
  } catch (error) {
    logger.error(error.message);
  }
};

reunionViewController.getReunionesByStudent = async (userId) => {
  try {
    reuniones = await reunionView.findAll({
      where: {
        estudianteId: userId,
        estadoId: {
          [Sequelize.Op.not]: 5
        }
      }
    });

    return reuniones;
  } catch (error) {
    logger.error(error.message);
  }
};

reunionViewController.getAllReuniones = async () => {
  try {
    reuniones = await reunionView.findAll();

    return reuniones;
  } catch (error) {
    logger.error(error.message);
  }
};

reunionViewController.getReunionesActivas = async () => {
  try {
    reuniones = await reunionView.findAll({
      where: {
        estadoId: {
          [Sequelize.Op.not]: 5
        }
      }
    });

    return reuniones;
  } catch (error) {
    logger.error(error.message);
  }
};

reunionViewController.getReunionById = async (reunionId) => {
  try {
    reunion = await reunionView.findByPk(reunionId);

    return reunion;
  } catch (error) {
    logger.error(error.message);
  }
};

reunionViewController.getLastMeetingId = async () => {
  try {
    lastMeeting = await reunionView.findOne({
      order: [['id', 'DESC']]
    });

    return lastMeeting.id;
  } catch (error) {
    logger.error(error.message);
  }
};

reunionViewController.getReunionesBySemestre = async (semesterId) => {
  try {
    reuniones = await reunionView.findAll({
      where: {
        semestreId: semesterId
      }
    });

    return reuniones;
  } catch (error) {
    logger.error(error.message);
  }
}

module.exports = reunionViewController;
