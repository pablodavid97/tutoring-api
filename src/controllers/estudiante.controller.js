const { logger } = require('../utils/logger');
const database = require('../models/connection-manager');
const estudiante = database.estudiante;
const estudianteController = {};
const gpaPorSemestreController = require('./gpa-por-semestre.controller')
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
    // placeholder
    students = await estudianteController.getAllStudents()
    studentNum = students.length

    globalGPA = 0
    for(var i = 0; i < studentNum; i++) {
      gpa = await gpaPorSemestreController.getAverageGPAByStudent(students[i].id)
      globalGPA += gpa
    }

    averageGPA = globalGPA / studentNum

    return averageGPA.toFixed(2)

  } catch (error) {
    logger.error(error.message);
  }
};

estudianteController.getConditionedStudents = async () => {
  try {
    // placeholder
    students = await estudiante.findAll();
    studentsNum = students.length

    conditionedUsers = []
    for(var i = 0; i < studentsNum; i++) {
      gpa = await gpaPorSemestreController.getAverageGPAByStudent(students[i].id)

      if(gpa < 2.5) {
        conditionedUsers.push(students[i])
      }
    }

    return conditionedUsers;
  } catch (error) {
    logger.error(error.message);
  }
};

estudianteController.getAverageGPABySemestre = async (semesterId) => {
  try {
    // placeholder
    students = await estudianteController.getAllStudents()
    studentNum = students.length

    globalGPA = 0
    for(var i = 0; i < studentNum; i++) {
      gpa = await gpaPorSemestreController.getSemesterGPAByStudent(students[i].id, semesterId)

      if(gpa){
        globalGPA += gpa
      }
    }

    averageGPA = 0 

    if(globalGPA > 0) {
      averageGPA = (globalGPA / studentNum).toFixed(2)
    }

    return averageGPA 

  } catch (error) {
    logger.error(error.message);
  }
}

estudianteController.getConditionedStudentsBySemestre = async (semesterId) => {
  try {
    // placeholder
    students = await estudiante.findAll();
    studentsNum = students.length

    conditionedUsers = []
    for(var i = 0; i < studentsNum; i++) {
      gpa = await gpaPorSemestreController.getSemesterGPAByStudent(students[i].id, semesterId)

      if(gpa < 2.5) {
        conditionedUsers.push(students[i])
      }
    }

    return conditionedUsers;
  } catch (error) {
    logger.error(error.message);
  }
};
 
// estudianteController.getEstudianteByField = async () => {

// }

module.exports = estudianteController;
