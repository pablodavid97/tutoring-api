const { log } = require('winston');
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller')
const rolController = require('../controllers/rol.controller')
const estudianteController = require('../controllers/estudiante.controller')
const decanoController = require('../controllers/decano.controller')
const profesorController = require('../controllers/profesor.controller')
const reunionController = require('../controllers/reunion.controller')
const estudianteViewController = require('../controllers/estudiante-view.controller')
const reunionViewController = require('../controllers/reunion-view.controller')
const profesorViewController = require('../controllers/profesor-view.controller');

module.exports = router