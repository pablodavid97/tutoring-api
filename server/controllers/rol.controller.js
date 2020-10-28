const database = require('../models/connection-manager')
const rol = database.rol
const usuario = database.usuario
const rolController = {}

//   INNER JOIN ROLES
rolController.getRoleUsers = async () => {
    try {
      const roles = await rol.findAll({include: [{model: usuario}]});
      return roles
    } catch(error) {
      console.error(error.message);
    }
  }

module.exports = rolController;