const database = require('../models/connection-manager')
const reunion = database.reunion
const reunionController = {}



// SELECT *
reunionController.find = async () => {
    try {
      const meeting = await reunion.findAll()
      return meeting
    } catch(error) {
      console.error(error.message);
    }
  } 
  

  module.exports = reunionController;