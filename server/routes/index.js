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
const notificacionViewController = require('../controllers/notificacion-view.controller');
const { logger } = require('../utils/logger');

router.get('/home', async (req, res) => {
  usuarioId = req.query.userId;
  rolId = req.query.rolId;

  isStudent = rolId === '3';

  studentInfo = undefined;
  tutor = undefined;

  try {
    rol = await rolController.getRolById(rolId);
    if (isStudent) {
      studentInfo = await estudianteController.getEstudianteById(usuarioId);

      profesorId = studentInfo.ProfesorId;

      tutor = await usuarioController.getUserById(profesorId);
    }

    // Actualiza las reuniones diarias
    await reunionController.setDailyMeetings();

    res.send({ rol, studentInfo, tutor });
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/tutor', async (req, res) => {
  rolId = req.query.rolId;
  estudianteId = req.query.estudianteId;

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
  try {
    estudiante = await estudianteViewController.getEstudianteById(estudianteId);
    res.json({ estudiante });
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/reports', async (req, res) => {
  try {
    reuniones = await reunionViewController.getReunionesActivas();
    gpa = await estudianteController.getAverageGPA();
    activeUsers = await usuarioController.getActiveUsers();
    conditionedUsers = await estudianteController.getConditionedStudents();

    res.json({ reuniones, gpa, activeUsers, conditionedUsers });
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/notifications', async (req, res) => {
  try {
    rolId = req.query.rolId;
    userId = req.query.userId;

    rol = await rolController.getRolById(rolId);

    notifications = await notificacionViewController.getNotificationsByUserId(
      userId
    );

    res.json({ rol, notifications });
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
  res.json(status);
});

//Estudiante
router.get('/estudiantes', async (req, res) => {
  let stud = await estudianteController.find();
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
  res.json(status);
});

//Reunion
router.get('/reuniones', async (req, res) => {
  let met = await reunionController.find();
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

router.post('/edit-profile', async (req, res) => {
  try {
    lastNames = req.body.lastNames;
    firstNames = req.body.firstNames;
    email = req.body.email;
    phone = req.body.phone;
    userId = req.body.userId;

    await usuarioController.setUserProfile(
      firstNames,
      lastNames,
      email,
      phone,
      userId
    );

    res.json({ status: 'ok' });
  } catch (error) {
    logger.error(error.message);
  }
});

router.post('/change-password', async (req, res) => {
  try {
    await usuarioController.setUserPassword(req.body.hash, req.body.userId);

    usuario = await usuarioController.getUserById(req.body.userId);

    res.json(usuario);
  } catch (error) {
    logger.error(error.message);
  }
});

module.exports = router;
