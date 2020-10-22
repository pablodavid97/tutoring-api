const database = require('../models/connection-manager')
const usuario = database.usuario
const rol = database.rol
const usuarioController = {}

// DB QUERIES

// FIND BY ID 
usuarioController.findById = async (userId) => {
    try{
        const rows = await usuario.findAll({
            where: {
                usuario_id: userId
            }
        });

        return rows[0]
    } catch (error) {
        console.error(error.message);
    }
}

// SELECT *
usuarioController.getAllUsers = async () => {
    try {
      const users = await usuario.findAll()
  
      return users
    } catch(error) {
      console.error(error.message);
    }
  } 
  
//  INNER JOIN USUARIOS
  usuarioController.getAllUsersRoles = async () => {
    try {
      const userRoles = await usuario.findAll({include: [{model: rol}]});
      return userRoles
    } catch(error) {
      console.error(error.message);
    }
  }

  module.exports = usuarioController;