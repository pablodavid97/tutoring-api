const database = require('../models/connection-manager')
const profesor = database.profesor
const profesorController = {}



// SELECT *
profesorController.find = async () => {
    try {
      const prof = await profesor.findAll()
      return prof
    } catch(error) {
      console.error(error.message);
    }
  } 
  

  module.exports = profesorController;