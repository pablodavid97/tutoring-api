const { logger } = require('../utils/logger');
const database = require('../models/connection-manager');
const estudiante = database.estudiante;
const estudianteController = {};
const { Sequelize } = require('sequelize');

estudianteController.getEstudianteById = async (estudianteId) => {
  try {
    console.log('UserId: ', estudianteId);
    const row = await estudiante.findByPk(estudianteId);

    console.log('Estudiante: ', row);

    return row;
  } catch (error) {
    logger.error(error.message);
  }
};

estudianteController.getAllStudentsByProfessor = async (profesorId) => {
  try {
    users = await estudiante.findAll({
      where: {
        profesorId: profesorId
      }
    });

    return users;
  } catch (error) {
    logger.error(error.message);
  }
};

estudianteController.getAllStudents = async () => {
  try {
    const estudiantes = await estudiante.findAll();

    console.log('Estudiantes: ', estudiantes.length);

    return estudiantes;
  } catch (error) {
    logger.error(error.message);
  }
};

estudianteController.getAverageGPA = async () => {
  console.log('Entro!');
  try {
    userNum = await estudianteController.getAllStudents();

    console.log('All Students: ', userNum.length);

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
