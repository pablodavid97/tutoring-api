const { logger } = require('../utils/logger');
const database = require('../models/connection-manager')
const imagen = database.imagen
const fs = require('fs')
const imagenController = {}

imagenController.uploadFile = async (file) => {
    try {        
        if(file === undefined) {
            console.log('You must select a file.')
            return
        }

        image = await imagen.create({
            formato: file.formato,
            nombre: file.nombre,
            datos: file.datos,
            createdOn: file.createdOn
        },
        {
            fields: [
              'formato',
              'nombre',
              'datos',
              'createdOn'
            ]
          }
        ).then(() => {
            fs.writeFileSync(
                global.appRoot + "/resources/static/assets/tmp/" + file.nombre,
                new Buffer.from(file.datos, "binary")
              );
            
            console.log("File has been uploaded");
        });

        return image

    } catch (error) {
        logger.error(error.message)
        return `Error when trying to upload image: ${error}`
    }
};

module.exports = imagenController