const { logger } = require('../utils/logger');
const database = require('../models/connection-manager');
const imagen = database.imagen;
const fs = require('fs');
const imagenController = {};

imagenController.uploadFile = async (file) => {
  try {
    if (file === undefined) {
      console.log('You must select a file.');
      return null;
    }

    const filePath =
      global.appRoot + '/resources/static/assets/tmp/' + file.nombre;

    console.log('Creating file into system');

    fs.writeFileSync(filePath, new Buffer.from(file.datos, 'binary'));

    imageData = fs.readFileSync(filePath);

    image = await imagen.create(
      {
        formato: file.formato,
        nombre: file.nombre,
        datos: imageData,
        uploadedOn: file.uploadedOn
      },
      {
        fields: ['formato', 'nombre', 'datos', 'uploadedOn']
      }
    );

    console.log('File has been stored into DB');

    console.log('Deleting created file from system...');

    // removes file after saved into DB
    fs.unlinkSync(filePath);

    console.log('File has been deleted');

    return image;
  } catch (error) {
    logger.error(error.message);
    return `Error when trying to upload image: ${error}`;
  }
};

imagenController.getLastImageId = async () => {
  try {
    lastImage = await imagen.findOne({
      order: [['id', 'DESC']]
    });

    return lastImage.id;
  } catch (error) {
    logger.error(error.message);
  }
};

imagenController.getImageById = async (imageId) => {
  try {
    image = await imagen.findAll({
      where: {
        id: imageId
      }
    });

    return image[0]
  } catch (error) {
    logger.error(error.message)
  }
}

module.exports = imagenController;
