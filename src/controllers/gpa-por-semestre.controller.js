const { sequelize } = require('../models/connection-manager');
const database = require('../models/connection-manager');
const { logger } = require('../utils/logger');
const gpaPorSemestre = database.gpaPorSemestre;
const gpaPorSemestreController = {};

gpaPorSemestreController.getAverageGPAByStudent = async (studentId) => {
  try {
    data = await gpaPorSemestre.findAll({
      attributes: [[sequelize.fn('avg', sequelize.col('gpa')), 'gpa']],
      where: {
        estudianteId: studentId
      }
    });

    gpa = data[0].dataValues.gpa;

    return gpa;
  } catch (error) {
    logger.error(error.message);
  }
};

gpaPorSemestreController.getSemesterGPAByStudent = async (
  studentId,
  semesterId
) => {
  try {
    data = await gpaPorSemestre.findAll({
      where: {
        estudianteId: studentId,
        semestreId: semesterId
      }
    });

    if (data.length > 0) {
      gpa = parseFloat(data[0].gpa);
    } else {
      gpa = undefined;
    }

    return gpa;
  } catch (error) {
    logger.error(error.message);
  }
};

gpaPorSemestreController.insertGPA = async (
  semesterId,
  studentId,
  gpaValue
) => {
  try {
    await gpaPorSemestre.create(
      {
        semestreId: semesterId,
        estudianteId: studentId,
        gpa: gpaValue
      },
      {
        fields: ['semestreId', 'estudianteId', 'gpa']
      }
    );
  } catch (error) {
    logger.error(error.message);
  }
};

module.exports = gpaPorSemestreController;
