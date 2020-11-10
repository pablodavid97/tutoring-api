const { logger } = require('../utils/logger');
const database = require('../models/connection-manager');
const estudiante = database.estudiante;
const estudianteController = {};
const { Sequelize } = require('sequelize');

estudianteController.getEstudianteById = async (estudianteId) => {
  try {
    const row = await estudiante.findByPk(estudianteId);

    return row;
  } catch (error) {
    logger.error(error.message);
  }
};

estudianteController.getAllStudents = async () => {
  try {
    const estudiantes = await estudiante.findAll();

    return estudiantes;
  } catch (error) {
    logger.error(error.message);
  }
};

estudianteController.getAverageGPA = async () => {
  try {
    userNum = await estudianteController.getAllStudents();

    globalGPA = await estudiante.sum('gpa');

    averageGPA = globalGPA / userNum.length;

    return averageGPA.toFixed(2);
  } catch (error) {
    logger.error(error.message);
  }
};

estudianteController.getConditionedStudents = async () => {
  try {
    users = await estudiante.findAll({
      where: {
        gpa: {
          [Sequelize.Op.lt]: 3
        }
      }
    });

    return users;
  } catch (error) {
    logger.error(error.message);
  }
};

// estudianteController.getEstudianteByField = async () => {

// }

module.exports = estudianteController;
