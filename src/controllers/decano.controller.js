const database = require('../models/connection-manager');
const { logger } = require('../utils/logger');
const decano = database.decano;
const decanoController = {};

//   INNER JOIN ROLES
decanoController.find = async () => {
  try {
    const dean = await decano.findAll();
    return dean;
  } catch (error) {
    logger.error(error.message);
  }
};

decanoController.insertDecano = async (userId, carrera) => {
  try {
    await decano.create(
      {
        id: userId,
        usuarioId: userId,
        carreraId: carrera
      },
      {
        fields: ['id', 'usuarioId', 'carreraId']
      }
    );
  } catch (error) {
    logger.error(error.message);
  }
};

module.exports = decanoController;
