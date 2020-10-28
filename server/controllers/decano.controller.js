const database = require('../models/connection-manager')
const decano = database.decano
const decanoController = {}

//   INNER JOIN ROLES
decanoController.find = async () => {
    try {
      const dean = await decano.findAll();
      return dean
    } catch(error) {
      console.error(error.message);
    }
  }
module.exports = decanoController;