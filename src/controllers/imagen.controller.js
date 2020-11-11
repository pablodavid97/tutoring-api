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

        fs.writeFileSync(
            global.appRoot + "/resources/static/assets/tmp/" + file.nombre,
            new Buffer.from(file.datos, "binary")
        );

        imageData = fs.readFileSync(global.appRoot + "/resources/static/assets/tmp/" + file.nombre)
        
        console.log("File has been uploaded");

        image = await imagen.create({
            formato: file.formato,
            nombre: file.nombre,
            datos: imageData,
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
        )

        return image

    } catch (error) {
        logger.error(error.message)
        return `Error when trying to upload image: ${error}`
    }
};

module.exports = imagenController