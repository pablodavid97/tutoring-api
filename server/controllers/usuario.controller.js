const database = require('../models/connection-manager')
const usuario = database.usuario
const usuarioController = {}



// SELECT *
usuarioController.find = async () => {
    try {
      const users = await usuario.findAll()
      return users
    } catch(error) {
      console.error(error.message);
    }
  } 
  

  module.exports = usuarioController;