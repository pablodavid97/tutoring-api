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

reunionViewController.getReunionesEliminadas = async () => {
  try {
    reunionesEliminadas = await reunionView.findAll({
      where: {
        estadoId: 5
      }
    });

    return reunionesEliminadas;
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

    console.log('Last meeting: ', lastMeeting);

    lastMeetingId = 0;

    if (lastMeeting != null) {
      lastMeetingId = lastMeeting.id;
    }

    return lastMeetingId;
  } catch (error) {
    logger.error(error.message);
  }
};

// Filtros por semestre
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
};

reunionViewController.getReunionesEliminadasBySemestre = async (semesterId) => {
  try {
    reunionesEliminadas = await reunionView.findAll({
      where: {
        estadoId: 5,
        semestreId: semesterId
      }
    });

    return reunionesEliminadas;
  } catch (error) {
    logger.error(error.message);
  }
};

// Filtros por carrera
reunionViewController.getReunionesByCarrera = async (carreraId) => {
  try {
    reuniones = await reunionView.findAll({
      where: {
        carreraId: carreraId
      }
    });

    return reuniones;
  } catch (error) {
    logger.error(error.message);
  }
};

reunionViewController.getReunionesEliminadasByCarrera = async (carreraId) => {
  try {
    reunionesEliminadas = await reunionView.findAll({
      where: {
        estadoId: 5,
        carreraId: carreraId
      }
    });

    return reunionesEliminadas;
  } catch (error) {
    logger.error(error.message);
  }
};

module.exports = reunionViewController;
