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

    return semester[0];
  } catch (error) {
    logger.error(error.message);
  }
};

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
    );

    // sets new current semester
    await semestre.update(
      { currentSemester: 1 },
      {
        where: {
          id: semesterId
        }
      }
    );
  } catch (error) {
    logger.error(error.message);
  }
};

semestreController.insertSemestre = async (id, semester, currentSemester) => {
  try {
    await semestre.create(
      {
        id: id,
        semestre: semester,
        currentSemester: currentSemester
      },
      {
        fields: ['id', 'semestre', 'currentSemester']
      }
    );
  } catch (error) {
    logger.error(error.message);
  }
};

semestreController.getLastSemestreId = async () => {
  try {
    lastSemester = await semestre.findOne({
      order: [['id', 'DESC']]
    });

    lastSemesterId = 0;

    if (lastSemester) {
      lastSemesterId = lastSemester.id;
    }

    return lastSemesterId;
  } catch (error) {
    logger.error(error.message);
  }
};

semestreController.getSemestreId = async (semesterItem) => {
  try {
    semester = await semestre.findAll({
      where: {
        semestre: semesterItem
      }
    });

    semesterId = undefined;

    if (semester.length > 0) {
      semesterId = semester[0].id;
    }

    return semesterId;
  } catch (error) {
    logger.error(error.message);
  }
};

// Truncates table
semestreController.clearTable = async () => {
  try {
    await semestre.destroy({
      where: {}
    });
  } catch (error) {
    logger.error(error.message);
  }
};

module.exports = semestreController;
