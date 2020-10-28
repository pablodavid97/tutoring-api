const express = require('express');
const { log } = require('winston');
const router = express.Router();
const decanoController = require('../controllers/decano.controller')
const estadoController = require('../controllers/estado.controller')
const estudianteController = require('../controllers/estudiante.controller')
const profesorController = require('../controllers/profesor.controller')
const reunionController = require('../controllers/reunion.controller')
const rolController = require('../controllers/rol.controller')
const usuarioController = require('../controllers/usuario.controller')

//Decano
router.get('/decanos', async (req, res) => {
    let dean = await decanoController.find()
    res.json(dean)
  });

//Estado
router.get('/estados', async (req, res) => {
    let status = await estadoController.find()
    console.log(status)
    res.json(status)
  });

//Estudiante
router.get('/estudiantes', async (req, res) => {
    let stud = await estudianteController.find()
    console.log(stud)
    res.json(stud)
  });

router.get('/estudiante/id', async (req, res)=>{
    id = 66
    let studid = await estudianteController.findById(id)
    res.json(studid)
});

//Profesor
router.get('/profesores', async (req, res) => {
    let status = await profesorController.find()
    console.log(status)
    res.json(status)
  });
  
//Reunion
router.get('/reuniones', async (req, res) => {
    let met = await reunionController.find()
    console.log(met)
    res.json(met)
  });

//Rol
router.get('/roles', async (req, res) => {
    let role = await rolController.find()
    res.json(role)
  });

//Usuario
router.get('/usuarios', async (req, res) => {
    let users = await usuarioController.find()
    res.json(users)
  });


module.exports = router