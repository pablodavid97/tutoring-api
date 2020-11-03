const { logger } = require('../utils/logger');
const database = require('../models/connection-manager');
const usuario = database.usuario;
const rol = database.rol;
const usuarioController = {};

// DB SELECT QUERIES

// FIND BY ID
usuarioController.getUserById = async (userId) => {
  try {
    const rows = await usuario.findByPk(userId);

    console.log('Usuario: ', rows);

    return rows;
  } catch (error) {
    logger.error(error.message);
  }
};

// FIND BY FIELD
usuarioController.getUserByEmail = async (email) => {
  try {
    user = await usuario.findAll({
      where: {
        correoInstitucional: email
      }
    });

    return user[0];
  } catch (error) {
    logger.error(error.message);
  }
};

// SELECT *
usuarioController.getAllUsers = async () => {
  try {
    const users = await usuario.findAll();

    return users;
  } catch (error) {
    logger.error(error.message);
  }
};

// SELECT WHERE FIRST TIME LOGIN = 0
usuarioController.getActiveUsers = async () => {
  try {
    users = await usuario.findAll({
      where: { firstTimeLogin: 0 }
    });

    return users;
  } catch (error) {
    logger.error(error.message);
  }
};

//  INNER JOIN USUARIOS ROLES
usuarioController.getAllUsersRoles = async () => {
  try {
    const userRoles = await usuario.findAll({ include: [{ model: rol }] });
    return userRoles;
  } catch (error) {
    logger.error(error.message);
  }
};

// DB UPDATE QUERIES
usuarioController.setUserPasswordOnCreate = async (hash, userId) => {
  try {
    await usuario.update(
      { hash: hash, firstTimeLogin: 0 },
      {
        where: {
          id: userId
        }
      }
    );
  } catch (error) {
    logger.error(error.message);
  }
};

module.exports = usuarioController;
