const { logger } = require('../utils/logger');
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const usuarioViewController = require('../controllers/usuario-view.controller');
const imagenController = require('../controllers/imagen.controller');
const rolesUsuarioViewController = require('../controllers/roles-usuario-view.controller');

router.get('/user-by-email', async (req, res) => {
  try {
    user = await usuarioViewController.getUserByEmail(req.query.email);
    console.log('user: ', user);

    res.json(user);
  } catch (error) {
    logger.error(error.message);
  }
});

router.get('/user-by-id', async (req, res) => {
  try {
    user = await usuarioViewController.getUserById(req.query.userId);

    res.json(user);
  } catch (error) {
    logger.error(error.message);
  }
});

router.get('/user-roles', async (req, res) => {
  try {
    usuarioId = req.query.userId;
    userRoles = await rolesUsuarioViewController.getUserRoles(usuarioId);

    res.send({ userRoles });
  } catch (error) {
    logger.error(error.message);
  }
});

router.get('/image-by-id', async (req, res) => {
  try {
    let imageId = req.query.imageId;

    console.log('Imagen Id: ', imageId);

    image = await imagenController.getImageById(imageId);

    image.datos = image.datos.toString('binary');

    res.json(image);
  } catch (error) {
    logger.error(error.message);
  }
});

router.post('/create-password', async (req, res) => {
  try {
    await usuarioController.setUserPasswordOnCreate(
      req.body.hash,
      req.body.userId
    );

    usuario = await usuarioViewController.getUserById(req.body.userId);

    res.json(usuario);
  } catch (error) {
    logger.error(error.message);
  }
});

module.exports = router;
