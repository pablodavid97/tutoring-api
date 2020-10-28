const database = require('../models/connection-manager')
const rol = database.rol
const usuario = database.usuario
const rolController = {}

rolController.getRolById = async (rolId) => {
  try {
    const rows = await rol.findByPk(rolId)
    console.log("Rol: ", rows);
    return rows

  } catch (error) {
    console.error(error.message);
  }
}

//   INNER JOIN ROLES
rolController.getRolUsers = async () => {
    try {
      const roles = await rol.findAll({include: [{model: usuario}]});
      return roles
    } catch(error) {
      console.error(error.message);
    }
  }

module.exports = rolController;