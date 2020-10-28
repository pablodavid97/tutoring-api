const database = require('../models/connection-manager')
const rol = database.rol
const rolController = {}

//   INNER JOIN ROLES
rolController.find = async () => {
    try {
      const roles = await rol.findAll();
      return roles
    } catch(error) {
      console.error(error.message);
    }
  }
module.exports = rolController;