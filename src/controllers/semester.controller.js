const database = require('../models/connection-manager');
const { logger } = require('../utils/logger');
const semestre = database.semestre;
const semestreController = {};

semestreController.getAllSemestres = async () => {
  try {
    let semestres = await semestre.findAll();
    return semestres;
  } catch (error) {
    logger.error(error.message);
  }
};

semestreController.getCurrentSemester = async () => {
  try {
    let semester = await semestre.findAll({
      where: {
        currentSemester: 1
      }
    });

    return semester[0]
  } catch(error) {
    logger.error(error.message)
  }
}

semestreController.setCurrentSemester = async (semesterId) => {
  try {
    // removes prev current semester
    await semestre.update(
      { currentSemester: 0 },
      {
        where: {
          currentSemester: 1
        }
      }
    )

    // sets new current semester
    await semestre.update(
      { currentSemester: 1},
      {
        where: {
          id: semesterId
        }
      }
    )


  } catch(error) {
    logger.error(error.message)
  }
}

module.exports = semestreController;
