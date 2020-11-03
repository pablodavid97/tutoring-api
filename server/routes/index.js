const { log } = require('winston');
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

router.get('/home', async (req, res) => {
  console.log('Got in!');

  console.log('Data: ', req.query);

  usuarioId = req.query.userId;
  rolId = req.query.rolId;

  isStudent = rolId === '3';

  console.log('Is student: ', isStudent);

  studentInfo = undefined;
  tutor = undefined;

  try {
    rol = await rolController.getRolById(rolId);
    console.log('Rol: ', rol);

    if (isStudent) {
      console.log('Entro!');
      studentInfo = await estudianteController.getEstudianteById(usuarioId);

      console.log('Student Info: ', studentInfo);

      profesorId = studentInfo.ProfesorId;

      console.log('Profesor Id: ', profesorId);

      tutor = await usuarioController.getUserById(profesorId);

      console.log('Tutor: ', tutor);
    }

    estudiantes = await estudianteViewController.getEstudiantes();
    profesores = await profesorViewController.getProfesores();
    reuniones = await reunionViewController.getReuniones();

    console.log('Numero de Estudiantes', estudiantes.length);
    console.log('Numero de Profesores', profesores.length);
    console.log('Reuniones', reuniones);

    res.send({ rol, studentInfo, tutor });
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/tutor', async (req, res) => {
  rolId = req.query.rolId;
  estudianteId = req.query.estudianteId;

  console.log('Rol Id: ', rolId);
  console.log('Estudiante Id: ', estudianteId);

  try {
    rol = await rolController.getRolById(rolId);
    studentInfo = await estudianteController.getEstudianteById(estudianteId);
    profesorId = studentInfo.ProfesorId;

    tutor = await usuarioController.getUserById(profesorId);

    res.json({ rol, studentInfo, tutor });
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/students', async (req, res) => {
  profesorId = req.query.profesorId;
  try {
    estudiantes = await estudianteViewController.getEstudiantesByProfesorId(
      profesorId
    );

    res.json(estudiantes);
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/student', async (req, res) => {
  estudianteId = req.query.userId;
  console.log('Estudiante Id: ', estudianteId);
  try {
    estudiante = await estudianteViewController.getEstudianteById(estudianteId);
    console.log('Estudiante: ', estudiante);

    res.json({ estudiante });
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/reports', async (req, res) => {
  try {
    reuniones = await reunionViewController.getReunionesActivas();
    console.log('Reuniones: ', reuniones);

    gpa = await estudianteController.getAverageGPA();
    console.log('Average GPA: ', gpa);

    activeUsers = await usuarioController.getActiveUsers();
    console.log('Active Users: ', activeUsers);

    conditionedUsers = await estudianteController.getConditionedStudents();

    res.json({ reuniones, gpa, activeUsers, conditionedUsers });
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/notifications', async (req, res) => {
  rolId = req.query.rolId;
  try {
    rol = await rolController.getRolById(rolId);

    console.log('rol: ', rol);

    res.json({ rol });
  } catch (error) {
    console.error(error.message);
  }
});

//Decano
router.get('/decanos', async (req, res) => {
  let dean = await decanoController.find();
  res.json(dean);
});

//Estado
router.get('/estados', async (req, res) => {
  let status = await estadoController.find();
  console.log(status);
  res.json(status);
});

//Estudiante
router.get('/estudiantes', async (req, res) => {
  let stud = await estudianteController.find();
  console.log(stud);
  res.json(stud);
});

router.get('/estudiante/id', async (req, res) => {
  id = 66;
  let studid = await estudianteController.findById(id);
  res.json(studid);
});

//Profesor
router.get('/profesores', async (req, res) => {
  let status = await profesorController.find();
  console.log(status);
  res.json(status);
});

//Reunion
router.get('/reuniones', async (req, res) => {
  let met = await reunionController.find();
  console.log(met);
  res.json(met);
});

//Rol
router.get('/roles', async (req, res) => {
  let role = await rolController.getRolById(1);
  res.json(role);
});

//Usuario
router.get('/usuarios', async (req, res) => {
  let users = await usuarioController.getAllUsers();
  res.json(users);
});

module.exports = router;
