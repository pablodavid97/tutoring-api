const database = require('../models/connection-manager');
const semestre = database.semestre;
const semestreController = {};

semestreController.getAllSemestres = async () => {
  try {
    const semestres = await semestre.findAll();
    return semestres;
  } catch (error) {
    console.error(error.message);
  }
};
module.exports = semestreController;
