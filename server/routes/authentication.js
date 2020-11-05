const { logger } = require('../utils/logger');
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const rolController = require('../controllers/rol.controller');
const estudianteController = require('../controllers/estudiante.controller');
const decanoController = require('../controllers/decano.controller');
const profesorController = require('../controllers/profesor.controller');
const reunionController = require('../controllers/reunion.controller');
const estudianteViewController = require('../controllers/estudiante-view.controller');
const reunionViewController = require('../controllers/reunion-view.controller');
const profesorViewController = require('../controllers/profesor-view.controller');

router.get('/user-by-email', async (req, res) => {
  try {
    console.log('Request: ', req.query);
    user = await usuarioController.getUserByEmail(req.query.email);

    console.log('User: ', user);

    res.json(user);
  } catch (error) {
    logger.error(error.message);
  }
});

router.get('/user-by-id', async (req, res) => {
  try {
    user = await usuarioController.getUserById(req.query.userId);

    res.json(user);
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

    usuario = await usuarioController.getUserById(req.body.userId);

    res.json(usuario);
  } catch (error) {
    logger.error(error.message);
  }
});

router.post('/change-password', async (req, res) => {
  try{
    await usuarioController.setUserPassword(
      req.body.hash,
      req.body.userId
    );

    usuario = await usuarioController.getUserById(req.body.userId);

    res.json(usuario);
  } catch(error) {
    logger.error(error.message)
  }
})

module.exports = router;
