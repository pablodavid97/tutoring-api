const { logger } = require('../utils/logger');
const database = require('../models/connection-manager');
const { Sequelize } = require('sequelize');
const usuario = database.usuario;
const rol = database.rol;
const usuarioController = {};

// DB SELECT QUERIES

// FIND BY ID
usuarioController.getUserById = async (userId) => {
  try {
    const rows = await usuario.findByPk(userId);

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

usuarioController.setUserPassword = async (hash, userId) => {
  try {
    await usuario.update(
      { hash: hash },
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

// Updates user profile with optional parameters
usuarioController.setUserProfile = async (
  code,
  email,
  firstNames,
  lastNames,
  personalEmail,
  phone,
  userId,
  imageId
) => {
  try {
    if (code) {
      await usuario.update(
        {
          codigo: code
        },
        {
          where: {
            id: userId
          }
        }
      );
    }

    if (email) {
      await usuario.update(
        {
          correoInstitucional: email
        },
        {
          where: {
            id: userId
          }
        }
      );
    }

    if (firstNames) {
      await usuario.update(
        { nombres: firstNames },
        {
          where: {
            id: userId
          }
        }
      );
    }

    if (lastNames) {
      await usuario.update(
        { apellidos: lastNames },
        {
          where: {
            id: userId
          }
        }
      );
    }

    if (personalEmail) {
      await usuario.update(
        { correoPersonal: personalEmail },
        {
          where: {
            id: userId
          }
        }
      );
    }

    if (phone) {
      await usuario.update(
        { telefono: phone },
        {
          where: {
            id: userId
          }
        }
      );
    }

    if (imageId) {
      await usuario.update(
        { imagenId: imageId },
        {
          where: {
            id: userId
          }
        }
      );
    }
  } catch (error) {
    logger.error(error.message);
  }
};

usuarioController.setUserProfilePicture = async (image, userId) => {
  try {
    await usuario.update(
      { fotoPerfil: image },
      {
        where: {
          id: userId
        }
      }
    );
  } catch (error) {
    logger.error(error);
  }
};

usuarioController.insertUser = async (userId, userObject, firstTimeLogin) => {
  try {
    await usuario.create(
      {
        id: userId,
        correoInstitucional: userObject.correoInstitucional,
        codigo: userObject.codigo,
        nombres: userObject.nombres,
        apellidos: userObject.apellidos,
        correoPersonal: userObject.correoPersonal,
        telefono: userObject.telefono,
        firstTimeLogin: firstTimeLogin
      },
      {
        fields: [
          'id',
          'correoInstitucional',
          'codigo',
          'nombres',
          'apellidos',
          'correoPersonal',
          'telefono',
          'firstTimeLogin'
        ]
      }
    );
  } catch (error) {
    logger.error(error);
  }
};

usuarioController.clearTable = async () => {
  try {
    await usuario.destroy({
      where: {
        // id: {
        //   [Sequelize.Op.not]: 1
        // }
      }
    });
  } catch (error) {
    logger.error(error.message);
  }
};

usuarioController.deleteUserById = async (userId) => {
  try {
    await usuario.destroy({
      where: {
        id: userId
      }
    });
  } catch (error) {
    logger.error(error.message);
  }
};

module.exports = usuarioController;
