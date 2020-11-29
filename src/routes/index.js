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

router.get('/home', async (req, res) => {
  usuarioId = req.query.userId;

  // converts request into json objects
  var requestRoles = req.query.userRoles;
  var length = requestRoles.length;

  userRoles = [];
  for (var i = 0; i < length; i++) {
    userRoles.push(JSON.parse(requestRoles[i]));
  }

  // information to be displayed for students
  isStudent = false;
  studentInfo = undefined;
  tutor = undefined;
  gpa = 0;
  gpaList = {};

  try {
    for (rol of userRoles) {
      if (rol.rolId === 3) {
        isStudent = true;
      }
    }

    if (isStudent) {
      studentInfo = await estudianteViewController.getEstudianteById(usuarioId);

      profesorId = studentInfo.profesorId;

      tutor = await usuarioViewController.getUserById(profesorId);

      gpa = await gpaPorSemestreController.getAverageGPAByStudent(
        studentInfo.id
      );

      gpaList = await gpaViewController.getGPAListByStudent(studentInfo.id);
    }

    // Actualiza las reuniones diarias
    await reunionController.setDailyMeetings();

    res.send({ studentInfo, tutor, gpa, gpaList });
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

router.get('/tutor', async (req, res) => {
  estudianteId = req.query.estudianteId;

  try {
    studentInfo = await estudianteController.getEstudianteById(estudianteId);
    profesorId = studentInfo.ProfesorId;

    tutor = await usuarioViewController.getUserById(profesorId);

    res.json({ studentInfo, tutor });
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

    for (student of estudiantes) {
      studentGPA = await gpaPorSemestreController.getAverageGPAByStudent(student.id)
      student.dataValues.gpa = studentGPA
    }

    res.json({estudiantes});
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/student', async (req, res) => {
  estudianteId = req.query.userId;
  try {
    estudiante = await estudianteViewController.getEstudianteById(estudianteId);
    gpa = await gpaPorSemestreController.getAverageGPAByStudent(estudianteId);
    gpaList = await gpaViewController.getGPAListByStudent(estudianteId);

    res.json({ estudiante, gpa, gpaList });
  } catch (error) {
    console.error(error.message);
  }
});

// value used for filters
router.get('/semesters', async (req, res) => {
  try {
    semestres = await semestreController.getAllSemestres();
    res.json({ semestres });
  } catch (error) {
    logger.error(error.message);
  }
});

router.get('/carreras', async (req, res) => {
  try {
    carreras = await carreraController.getAllCarreras();

    res.json({ carreras });
  } catch (error) {
    logger.error(error.message);
  }
});

router.get('/reports', async (req, res) => {
  try {
    reuniones = await reunionViewController.getAllReuniones();

    reunionesEliminadas = await reunionViewController.getReunionesEliminadas();

    conditionedUsers = await estudianteController.getConditionedStudents();
    conditionedUsersNum = conditionedUsers.length;

    gpa = await estudianteController.getAverageGPA();

    res.json({ reuniones, reunionesEliminadas, gpa, conditionedUsersNum });
  } catch (error) {
    logger.error(error.message);
  }
});

// filters applied
router.get('/reports-by-semester/', async (req, res) => {
  try {
    semesterId = req.query.semesterId;

    if (semesterId === '0') {
      reuniones = await reunionViewController.getAllReuniones();

      reunionesEliminadas = await reunionViewController.getReunionesEliminadas();

      conditionedUsers = await estudianteController.getConditionedStudents();
      conditionedUsersNum = conditionedUsers.length;

      gpa = await estudianteController.getAverageGPA();
    } else {
      reuniones = await reunionViewController.getReunionesBySemestre(
        semesterId
      );

      reunionesEliminadas = await reunionViewController.getReunionesEliminadasBySemestre(
        semesterId
      );

      conditionedUsers = await estudianteController.getConditionedStudentsBySemestre(
        semesterId
      );
      conditionedUsersNum = conditionedUsers.length;

      gpa = await estudianteController.getAverageGPABySemestre(semesterId);
    }

    res.json({ reuniones, reunionesEliminadas, gpa, conditionedUsersNum });
  } catch (error) {
    logger.error(error.message);
  }
});

router.get('/reports-by-carrera/', async (req, res) => {
  try {
    carreraId = req.query.carreraId;

    if (carreraId === '0') {
      reuniones = await reunionViewController.getAllReuniones();

      reunionesEliminadas = await reunionViewController.getReunionesEliminadas();

      conditionedUsers = await estudianteController.getConditionedStudents();
      conditionedUsersNum = conditionedUsers.length;

      gpa = await estudianteController.getAverageGPA();
    } else {
      reuniones = await reunionViewController.getReunionesByCarrera(carreraId)

      reunionesEliminadas = await reunionViewController.getReunionesEliminadasByCarrera(carreraId)

      conditionedUsers = await estudianteController.getConditionedStudentsByCarrera(
        carreraId
      );
      conditionedUsersNum = conditionedUsers.length;

      gpa = await estudianteController.getAverageGPAByCarrera(carreraId);
    }

    res.json({ reuniones, reunionesEliminadas, gpa, conditionedUsersNum });
  } catch (error) {
    logger.error(error.message);
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
    logger.error(error.message);
  }
});

router.get('/active-notifications', async (req, res) => {
  try {
    notifications = await notificacionViewController.getActiveNotificationsByUserId(
      req.query.userId
    );

    res.json({ notifications });
  } catch (error) {
    logger.error(error.message);
  }
});

router.post('/delete-notification', async (req, res) => {
  try {
    await notificacionController.deleteNotificacion(req.body.notificationId);

    res.json({ status: 'ok' });
  } catch (error) {
    logger.error(error.message);
  }
});

router.post('/archive-notification', async (req, res) => {
  try {
    await notificacionController.updateNotificationStatus(
      3,
      req.body.notificationId
    );

    res.json({ status: 'ok' });
  } catch (error) {
    logger.error(error.message);
  }
});

router.post('/viewed-notification', async (req, res) => {
  try {
    await notificacionController.updateNotificationStatus(
      2,
      req.body.notificationId
    );

    res.json({ status: 'ok' });
  } catch (error) {
    logger.error(error.message);
  }
});

router.post('/edit-profile', async (req, res) => {
  try {
    lastNames = req.body.lastNames;
    firstNames = req.body.firstNames;
    email = req.body.email;
    phone = req.body.phone;
    userId = req.body.userId;
    file = req.body.file;

    lastImageId = undefined;

    if (file) {
      image = await imagenController.uploadFile(file);

      lastImageId = await imagenController.getLastImageId();
    }

    await usuarioController.setUserProfile(
      firstNames,
      lastNames,
      email,
      phone,
      userId,
      lastImageId
    );

    res.json({ status: 'ok' });
  } catch (error) {
    logger.error(error.message);
  }
});

router.post('/change-password', async (req, res) => {
  try {
    await usuarioController.setUserPassword(req.body.hash, req.body.userId);

    usuario = await usuarioViewController.getUserById(req.body.userId);

    res.json(usuario);
  } catch (error) {
    logger.error(error.message);
  }
});

router.get('/current_semester', async (req, res) => {
  try {
    semestre = await semestreController.getCurrentSemester();

    res.json({semestre});
  } catch (error) {
    logger.error(error.message);
  }
})

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

module.exports = router;
