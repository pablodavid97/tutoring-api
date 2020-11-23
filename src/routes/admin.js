const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const usuarioViewController = require('../controllers/usuario-view.controller');
const rolController = require('../controllers/rol.controller');
const estudianteController = require('../controllers/estudiante.controller');
const decanoController = require('../controllers/decano.controller');
const profesorController = require('../controllers/profesor.controller');
const reunionController = require('../controllers/reunion.controller');
const estudianteViewController = require('../controllers/estudiante-view.controller');
const reunionViewController = require('../controllers/reunion-view.controller');
const profesorViewController = require('../controllers/profesor-view.controller');
const notificacionViewController = require('../controllers/notificacion-view.controller');
const { logger } = require('../utils/logger');
const imagenController = require('../controllers/imagen.controller');
const notificacionController = require('../controllers/notificacion.controller');
const semestreController = require('../controllers/semester.controller');
const gpaPorSemestreController = require('../controllers/gpa-por-semestre.controller');
const carreraController = require('../controllers/carrera.controller');
const gpaViewController = require('../controllers/gpa-view.controller');
const rolesUsuarioViewController = require('../controllers/roles-usuario-view.controller');

router.get('/', async (req, res) => {
  try {
    users = await usuarioViewController.getAllUsuarios();

    for (user of users) {
      roles = await rolesUsuarioViewController.getUserRoles(user.id);

      console.log('Roles: ', roles[0]);

      var txt = '';
      for (rol of roles) {
        txt += rol.rol + ' ';
      }

      console.log('Text: ', txt);
      user.dataValues.roles = roles;
      user.dataValues.rolesText = txt;
    }

    // console.log("Users: ", users);

    res.json({ users });
  } catch (error) {
    logger.error(error.message);
  }
});

router.post('/upload', async (req, res) => {
  try {
    upload = await imagenController.uploadFile(req.body.file);

    res.json({ status: 'ok' });
  } catch (error) {
    logger.error(error.message);
  }
});

module.exports = router;
