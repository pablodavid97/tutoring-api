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
const fs = require('fs');
const { getNotificationByMeetingId } = require('../controllers/notificacion.controller');
const estadoController = require('../controllers/estado.controller');
const estadoNotificacionController = require('../controllers/estado-notificacion.controller');
const csv = require('csvtojson');
const rolesUsuarioController = require('../controllers/roles-usuario.controller');
const rolesUsuarioModel = require('../models/entities/roles-usuario.model');

router.get('/', async (req, res) => {
  try {
    users = await usuarioViewController.getAllUsuarios();

    for (user of users) {
      roles = await rolesUsuarioViewController.getUserRoles(user.id);

      var txt = '';
      for (rol of roles) {
        txt += rol.rol + ' ';
      }

      user.dataValues.roles = roles;
      user.dataValues.rolesText = txt;
    }

    semesters = await semestreController.getAllSemestres();

    // console.log("Users: ", users);

    res.json({ users, semesters });
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

router.post('/current-semester', async (req, res) => {
  try {
    semesterId = req.body.semesterId;

    await semestreController.setCurrentSemester(semesterId);

    res.json({ status: 'ok' });
  } catch (error) {
    logger.error(error.message);
  }
});

router.post('/files-upload', async (req, res) => {
  files = req.body.files

  const filesPath = global.appRoot + '/resources/static/assets/tmp/';
  const careersPath = filesPath + files.careers.nombre
  const semestersPath = filesPath + files.semesters.nombre
  const deansPath = filesPath + files.deans.nombre
  const professorsPath = filesPath + files.professors.nombre
  const studentsPath = filesPath + files.students.nombre
  const adminsPath = filesPath + files.admins.nombre

  console.log('Creating files...');

  fs.writeFileSync(careersPath, new Buffer.from(files.careers.datos, 'binary'));
  fs.writeFileSync(semestersPath, new Buffer.from(files.semesters.datos, 'binary'));
  fs.writeFileSync(deansPath, new Buffer.from(files.deans.datos, 'binary'));
  fs.writeFileSync(professorsPath, new Buffer.from(files.professors.datos, 'binary'));
  fs.writeFileSync(studentsPath, new Buffer.from(files.students.datos, 'binary'));
  fs.writeFileSync(adminsPath, new Buffer.from(files.admins.datos, 'binary'));

  console.log("Files were created successfully!");


  await fileParser(filesPath)

  res.json({ status: 'ok' });

})

let fileParser = async (filesPath) => {
  const DECANO_ROL = 1
  const PROFESOR_ROL = 2
  const ESTUDIANTE_ROL = 3
  const ADMIN_ROL = 4
  const DEFAULT_FIRST_TIME_LOGIN_VALUE = 1

  let roles = [{id: DECANO_ROL, name: "Decano"}, {id: PROFESOR_ROL, name: "Profesor"}, {id: ESTUDIANTE_ROL, name: "Estudiante"}, {id: ADMIN_ROL, name: "Administrador"}]
  let estadosReunion = [{id: 1, estado: "Creada"}, {id: 2, estado: "Editada"}, {id: 3, estado: "Aceptada"}, {id: 4, estado: "Rechazada"}, {id: 5, estado: "Eliminada"}, {id: 6, estado: "En Progreso"}, {id: 7, estado: "Realizada"}, {id: 8, estado: "No Realizada"}]
  let estadosNotificacion = [{id: 1, estado: "Activa"}, {id: 2, estado: "Leida"}, {id: 3, estado: "Archivada"}]
  let superuser = {id: 1, correoInstitucional: "admin@usfq.edu.ec", codigo: "", hash: "$2a$10$.Mqxo.yyACYbzsHfSR2ih.65jZ0H0z4IR6Hrcor6TWPtoGk77j.nq", nombres: "Admin", apellidos: "User", correoPersonal: "", telefono: "", firstTimeLogin: 0}
  let semestersFileName = "semestersFile.csv"
  let careersFileName = "careersFile.csv"
  let deansFileName = "deansFile.csv"
  let professorsFileName = "professorsFile.csv"
  let studentsFileName = "studentsFile.csv"
  let adminsFileName = "adminsFile.csv"
  let currentSemester = 1
  let idCounter = 1
  // correos electronicos de usuarios registrados
  let insertedUsers = []

  // Elimina los roles creados
  await rolController.clearTable()

  // Inserta los roles a la BD
  for(rol of roles) {
    await rolController.insertRol(rol)
  }

  // Elimina los estados de reuniones creados
  await estadoController.clearTable()

  // Inserta los estados de reuniones a la BD
  for(estado of estadosReunion) {
    await estadoController.insertEstado(estado)
  }

  // Elimina los estados de notificaciones creadas
  await estadoNotificacionController.clearTable()

  // Inserta los estados de notificaciones en BD
  for(estado of estadosNotificacion) {
    await estadoNotificacionController.insertEstado(estado)
  }

  // Lee las carreras
  let carreras = await csv().fromFile(filesPath + careersFileName)

  // Elimina las carreras
  await carreraController.clearTable()

  // Inserta las carreras en BD
  carreraId = 0
  for(carrera of carreras) {
    carreraId += 1
    await carreraController.insertCarrera(carreraId, carrera.carrera)
  }

  // Lee los semestres
  let semestres = await csv().fromFile(filesPath + semestersFileName)

  // Elimina los semestres
  await semestreController.clearTable()

  // Inserta los semestres en BD
  semestreId = 0
  for(semestre of semestres) {
    semestreId += 1

    if(semestreId === currentSemester) {
      await semestreController.insertSemestre(semestreId, semestre.semestre, 1)
    } else {
      await semestreController.insertSemestre(semestreId, semestre.semestre, 0)
    }
  }

  // Elimina usuarios registrados
  await usuarioController.clearTable()

  // Inserta super usuario a la BD
  await usuarioController.insertUser(idCounter, superuser, superuser.firstTimeLogin)
  await usuarioController.setUserPassword(superuser.hash, idCounter)
  insertedUsers.push(superuser)

  // Inserta el rol de admin a super usuario en BD
  await rolesUsuarioController.insertRolDeUsuario(idCounter, ADMIN_ROL)

  // Lee la lista de admins
  let admins = await csv().fromFile(filesPath + adminsFileName)

  // Lee la lista de decanos
  let decanos = await csv().fromFile(filesPath + deansFileName)

  // Lee la lista de estudiantes
  let estudiantes = await csv().fromFile(filesPath + studentsFileName)

  // Lee la lista de profesores
  let profesores = await csv().fromFile(filesPath + professorsFileName)

  console.log("Carreras: ", carreras);
  console.log("Semestres: ", semestres);
  console.log("Admins: ", admins);
  console.log("Decanos: ", decanos);
  console.log("Estudiantes: ", estudiantes);
  console.log("Profesores: ", profesores);

  // Inserta la lista de decanos en BD
  for(decano of decanos) {
    userId = userExists(decano.correoInstitucional, insertedUsers)

    if(userId === -1) {
      idCounter += 1

      // inserta nuevo usuario
      await usuarioController.insertUser(idCounter, decano, DEFAULT_FIRST_TIME_LOGIN_VALUE)

      // inserta nuevo decano
      carreraId = getCarreraId(decano.carrera, carreras)
      await decanoController.insertDecano(idCounter, carreraId)

      // inserta rol de usuario
      await rolesUsuarioController.insertRolDeUsuario(idCounter, DECANO_ROL)

      // inserta usuario en lista de usuarios
      insertedUsers.push(decano.correoInstitucional)

    } else {
      // inserta nuevo decano
      carreraId = getCarreraId(decano.carrera, carreras)
      await decanoController.insertDecano(userId, carreraId)

      // inserta rol de usuario
      await rolesUsuarioController.insertRolDeUsuario(userId, DECANO_ROL)
    }
  }

  // Inserta la lista de profesores en BD
  for(profesor of profesores) {
    userId = userExists(profesor.correoInstitucional, insertedUsers)

    if(userId === -1) {
      idCounter += 1

      // inserta nuevo usuario
      await usuarioController.insertUser(idCounter, profesor, DEFAULT_FIRST_TIME_LOGIN_VALUE)

      // inserta nuevo profesor
      carreraId = getCarreraId(profesor.carrera, carreras)
      await profesorController.insertProfesor(idCounter, carreraId)

      // inserta rol de usuario
      await rolesUsuarioController.insertRolDeUsuario(idCounter, PROFESOR_ROL)

      // inserta usuario
      insertedUsers.push(profesor.correoInstitucional)

    } else {
      // inserta nuevo profesor
      carreraId = getCarreraId(profesor.carrera, carreras)
      await profesorController.insertProfesor(userId, carreraId)

      // inserta rol de usuario
      await rolesUsuarioController.insertRolDeUsuario(userId, PROFESOR_ROL)
    }
  }

  // Inserta la lista de estudiantes en la BD
  for(estudiante of estudiantes) {
    userId = userExists(estudiante.correoInstitucional, insertedUsers)

    if(userId === -1) {
      idCounter += 1

      await usuarioController.insertUser(idCounter, estudiante, DEFAULT_FIRST_TIME_LOGIN_VALUE)

      profesorId = userExists(estudiante.correoProfesor, insertedUsers)

      carreraId = getCarreraId(estudiante.carrera, carreras)
      await estudianteController.insertEstudiante(idCounter, estudiante, profesorId, carreraId)

      await rolesUsuarioController.insertRolDeUsuario(idCounter, ESTUDIANTE_ROL)

      await gpaPorSemestreController.insertGPA(currentSemester, idCounter, estudiante.gpa)

      insertedUsers.push(estudiante.correoInstitucional)
    }
  }

  // Inserta la lista de admins en la BD
  for(admin of admins) {
    userId = userExists(admin.correoInstitucional, insertedUsers)

    if(userId === -1) {
      idCounter += 1

      await usuarioController.insertUser(idCounter, admin, DEFAULT_FIRST_TIME_LOGIN_VALUE)

      await rolesUsuarioController.insertRolDeUsuario(idCounter, ADMIN_ROL)

      insertedUsers.push(admin.correoInstitucional)
    } else {
      await rolesUsuarioController.insertRolDeUsuario(userId, ADMIN_ROL)
    }
  }
}

// Helper functions for file parser
let getCarreraId = (item, itemList) => {
  length = itemList.length
  indx = -1

  console.log("carrera: ", item);
  console.log("carreras: ", itemList);

  for(let i = 0; i < length; i++) {
    console.log("Carrera: ", item);
    console.log("carretas item type: ", itemList[i].carrera);
  
    if(item === itemList[i].carrera) {
      indx = i + 1
      break
    }
  }

  return indx
}

let userExists = (email, emailList) => {
  userId = -1
  idCounter = 0

  for(item of emailList) {
    idCounter += 1

    if(email === item) {
      userId = idCounter
      break
    }
  }

  return userId
}
 
module.exports = router;
