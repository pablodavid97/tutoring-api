const database = require('../models/connection-manager')
const estudiante = database.estudiante
const estudianteController = {}



// SELECT *
estudianteController.find = async () => {
    try {
      const estud = await estudiante.findAll()
      return estud
    } catch(error) {
      console.error(error.message);
    }
  } 
  
estudianteController.findById = async (id)=>{
  try{
    const estud = await estudiante.findAll({
      where:{
        id: id
      }
    });
    return estud[0]
  }catch(error){
    console.error(error.message);
  }
}

  module.exports = estudianteController;