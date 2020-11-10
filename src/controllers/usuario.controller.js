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
  firstNames,
  lastNames,
  email,
  phone,
  userId
) => {
  try {
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

    if (email) {
      await usuario.update(
        { correoPersonal: email },
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
  } catch (error) {
    logger.error(error.message);
  }
};

usuarioController.setUserProfilePicture = async (image, userId) => {
  try {
    await usuario.update({fotoPerfil: image}, {
      where: {
      id: userId
    }})
  } catch (error) {
    logger.error(error)
  }
}

module.exports = usuarioController;
