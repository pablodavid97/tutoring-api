const { logger } = require('../utils/logger');
const database = require('../models/connection-manager')
const usuario = database.usuario
const rol = database.rol
const usuarioController = {}

// DB QUERIES

// FIND BY ID 
usuarioController.getUserById = async (userId) => {
    try{
        const rows = await usuario.findByPk(userId)

        console.log("Usuario: ", rows);

        return rows
    } catch (error) {
        logger.error(error.message);
    }
}

// SELECT *
usuarioController.getAllUsers = async () => {
    try {
      const users = await usuario.findAll()
  
      return users
    } catch(error) {
      logger.error(error.message);
    }
  } 
  
//  INNER JOIN USUARIOS
  usuarioController.getAllUsersRoles = async () => {
    try {
      const userRoles = await usuario.findAll({include: [{model: rol}]});
      return userRoles
    } catch(error) {
      logger.error(error.message);
    }
  }

  module.exports = usuarioController;