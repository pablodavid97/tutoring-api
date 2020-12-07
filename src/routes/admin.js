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
const { getUserByEmail } = require('../controllers/usuario.controller');
const { usuarioView } = require('../models/connection-manager');

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

    careers = await carreraController.getAllCarreras();

    res.json({ users, semesters, careers });
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
  const gpasPath = filesPath + files.gpas.nombre
  const adminsPath = filesPath + files.admins.nombre

  console.log('Creating files...');

  fs.writeFileSync(careersPath, new Buffer.from(files.careers.datos, 'binary'));
  fs.writeFileSync(semestersPath, new Buffer.from(files.semesters.datos, 'binary'));
  fs.writeFileSync(deansPath, new Buffer.from(files.deans.datos, 'binary'));
  fs.writeFileSync(professorsPath, new Buffer.from(files.professors.datos, 'binary'));
  fs.writeFileSync(studentsPath, new Buffer.from(files.students.datos, 'binary'));
  fs.writeFileSync(gpasPath, new Buffer.from(files.gpas.datos, 'binary'));
  fs.writeFileSync(adminsPath, new Buffer.from(files.admins.datos, 'binary'));

  console.log("Files were created successfully!");

  await fileParser(filesPath)

  console.log("Deleting files...");

  fs.unlinkSync(careersPath);
  fs.unlinkSync(semestersPath);
  fs.unlinkSync(deansPath);
  fs.unlinkSync(professorsPath);
  fs.unlinkSync(studentsPath);
  fs.unlinkSync(gpasPath);
  fs.unlinkSync(adminsPath);

  console.log("Files were deleted!");

  res.json({ status: 'ok' });
})

router.get('/users', async (req, res) => {
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

    res.json({ users });
  } catch (error) {
    logger.error(error.message);
  }
});

router.post('/edit-user', async (req, res) => {
  try {
    code = req.body.code,
    email = req.body.email,
    lastNames = req.body.lastNames;
    firstNames = req.body.firstNames;
    personalEmail = req.body.personalEmail;
    phone = req.body.phone;
    userId = req.body.userId;
    file = req.body.file;

    lastImageId = undefined;

    if (file) {
      image = await imagenController.uploadFile(file);

      lastImageId = await imagenController.getLastImageId();
    }

    await usuarioController.setUserProfile(
      code,
      email,
      firstNames,
      lastNames,
      personalEmail,
      phone,
      userId,
      lastImageId
    );

    res.json({ status: 'ok' });
  } catch (error) {
    logger.error(error.message);
  }
})

router.post('/delete-user', async (req, res) => {
  try {
    userId = req.body.userId
    await usuarioController.deleteUserById(userId)

    res.json({ status: 'ok' });
  } catch (error) {
    logger.error(error.message)
  }
})

router.post('/add-users', async (req, res) => {
  files = req.body.files

  const filesPath = global.appRoot + '/resources/static/assets/tmp/';
  let deansPath = undefined
  let professorsPath = undefined
  let studentsPath = undefined
  let adminsPath = undefined

  console.log('Creating files...');

  if(files.deans) {
    console.log("deans: ", files.deans);
    deansPath = filesPath + files.deans.nombre

    fs.writeFileSync(deansPath, new Buffer.from(files.deans.datos, 'binary'));
  }

  if(files.professors) {
    professorsPath = filesPath + files.professors.nombre
    fs.writeFileSync(professorsPath, new Buffer.from(files.professors.datos, 'binary'));
  }

  if(files.students) {
    studentsPath = filesPath + files.students.nombre
    fs.writeFileSync(studentsPath, new Buffer.from(files.students.datos, 'binary'));
  }

  if(files.admins) {
    adminsPath = filesPath + files.admins.nombre
    fs.writeFileSync(adminsPath, new Buffer.from(files.admins.datos, 'binary'));
  }

  console.log("Files were created successfully!");

  // inserta los usuarios en la BD
  await fileParserAdditionalUsers(deansPath, professorsPath, studentsPath, adminsPath)

  console.log("Deleting files...");

  if(deansPath) {
    fs.unlinkSync(deansPath);
  }

  if(professorsPath) {
    fs.unlinkSync(professorsPath);
  }

  if(studentsPath) {
    fs.unlinkSync(studentsPath);
  }

  if(adminsPath) {
    fs.unlinkSync(adminsPath);
  }

  console.log("Files were deleted!");

  res.json({ status: 'ok' });
});

router.post('/additional-files', async (req, res) => {
  files = req.body.files

  const filesPath = global.appRoot + '/resources/static/assets/tmp/';
  let careersPath = undefined
  let semestersPath = undefined
  let gpasPath = undefined

  console.log('Creating files...');

  if(files.careers) {
    careersPath = filesPath + files.careers.nombre
    fs.writeFileSync(careersPath, new Buffer.from(files.careers.datos, 'binary'));
  }

  if(files.semesters) {
    semestersPath = filesPath + files.semesters.nombre
    fs.writeFileSync(semestersPath, new Buffer.from(files.semesters.datos, 'binary'));
  }

  if(files.gpas) {
    gpasPath = filesPath + files.gpas.nombre
    fs.writeFileSync(gpasPath, new Buffer.from(files.gpas.datos, 'binary'));
  }

  console.log("Files were created successfully!");

  // inserta los archivos adicionales en la BD
  await fileParserAdditionalData(careersPath, semestersPath, gpasPath)

  console.log("Deleting files...");

  if(careersPath) {
    fs.unlinkSync(careersPath);
  }

  if(semestersPath) {
    fs.unlinkSync(semestersPath);
  }

  if(gpasPath) {
    fs.unlinkSync(gpasPath);
  }

  console.log("Files were deleted!");

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
  let gpasFileName = "gpasFile.csv"
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

  // Lee la lista de gpas
  let gpas = await csv().fromFile(filesPath + gpasFileName)

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

      insertedUsers.push(estudiante.correoInstitucional)
    }
  }

  // Inserta los gpas por semestre en la BD
  for(gpa of gpas) {
    let userId = userExists(gpa.correoInstitucional, insertedUsers)
    let semesterId = getSemestreId(gpa.semestre, semestres)

    if(userId !== -1 && semesterId !== -1) {
      await gpaPorSemestreController.insertGPA(semesterId, userId, gpa.gpa)
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

  for(let i = 0; i < length; i++) {  
    if(item === itemList[i].carrera) {
      indx = i + 1
      break
    }
  }

  return indx
}

let getSemestreId = (item, itemList) => {
  length = itemList.length
  indx = -1

  for(let i = 0; i < length; i++) {
    if(item === itemList[i].semestre) {
      indx = i + 1
      break
    }
  }

  return indx
}

// verifies if user exists with email
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

let fileParserAdditionalUsers = async (deansPath, professorsPath, studentsPath, adminsPath) => {
  const DECANO_ROL = 1
  const PROFESOR_ROL = 2
  const ESTUDIANTE_ROL = 3
  const ADMIN_ROL = 4
  const DEFAULT_FIRST_TIME_LOGIN_VALUE = 1
  let admins = undefined;
  let deans = undefined;
  let professors = undefined;
  let students = undefined

  if(deansPath) {
    // Lee la lista de decanos
    deans = await csv().fromFile(deansPath)

    // Inserta la lista de decanos en la BD
    for(dean of deans) {
      deanUser = await usuarioViewController.getUserByEmail(dean.correoInstitucional)

      if(deanUser === undefined) {
        lastUserId = await usuarioViewController.getLastUserId()
        userId = lastUserId + 1

        await usuarioController.insertUser(userId, dean, DEFAULT_FIRST_TIME_LOGIN_VALUE)

        // solo inserta la carrera si esta existe
        carreraId = await carreraController.getCarreraId(dean.carrera)
        if(carreraId) {
          // inserta decano
          await decanoController.insertDecano(userId, carreraId)
        }

        await rolesUsuarioController.insertRolDeUsuario(userId, DECANO_ROL)
      } else {
        await rolesUsuarioController.insertRolDeUsuario(deanUser.id, DECANO_ROL)
      }
    }
  }

  if(professorsPath) {
    // Lee la lista de profesores
    professors = await csv().fromFile(professorsPath)

    // Inserta la lista de decanos en la BD
    for(professor of professors) {
      professorUser = await usuarioViewController.getUserByEmail(professor.correoInstitucional)

      if(professorUser === undefined) {
        lastUserId = await usuarioViewController.getLastUserId()
        userId = lastUserId + 1

        await usuarioController.insertUser(userId, professor, DEFAULT_FIRST_TIME_LOGIN_VALUE)

         // solo inserta la carrera si esta existe
         carreraId = await carreraController.getCarreraId(professor.carrera)
         if(carreraId) {
           // inserta profesor
           await profesorController.insertProfesor(userId, carreraId)
         }

        await rolesUsuarioController.insertRolDeUsuario(userId, PROFESOR_ROL)
      } else {
        await rolesUsuarioController.insertRolDeUsuario(professorUser.id, PROFESOR_ROL)
      }
    }
  }

  if(studentsPath) {
    // Lee la lista de estudiantes
    students = await csv().fromFile(studentsPath)

    // Inserta la lista de decanos en la BD
    for(student of students) {
      studentUser = await usuarioViewController.getUserByEmail(student.correoInstitucional)

      if(studentUser === undefined) {
        lastUserId = await usuarioViewController.getLastUserId()
        userId = lastUserId + 1

        await usuarioController.insertUser(userId, student, DEFAULT_FIRST_TIME_LOGIN_VALUE)

        tutor = await usuarioViewController.getUserByEmail(student.correoProfesor)

        // solo inserta la carrera si esta existe
         carreraId = await carreraController.getCarreraId(student.carrera)
         if(carreraId) {
           await estudianteController.insertEstudiante(userId, student, tutor.id, carreraId)
         }

        await rolesUsuarioController.insertRolDeUsuario(userId, ESTUDIANTE_ROL)
      }
    }
  }

  if(adminsPath) {
    // Lee la lista de admins
    admins = await csv().fromFile(adminsPath)

    // Inserta la lista de admins en la BD
    for(admin of admins) {
      adminUser = await usuarioViewController.getUserByEmail(admin.correoInstitucional)

      if(adminUser === undefined) {
        lastUserId = await usuarioViewController.getLastUserId()
        userId = lastUserId + 1

        await usuarioController.insertUser(userId, admin, DEFAULT_FIRST_TIME_LOGIN_VALUE)

        await rolesUsuarioController.insertRolDeUsuario(userId, ADMIN_ROL)
      } else {
        await rolesUsuarioController.insertRolDeUsuario(adminUser.id, ADMIN_ROL)
      }
    }
  }
}

let fileParserAdditionalData = async (careersPath, semestersPath, gpasPath) => {
  let careers = undefined;
  let semesters = undefined;
  let gpas = undefined

  if(careersPath) {
    // Lee las carreras
    careers = await csv().fromFile(careersPath)

    for(career of careers) {
      careerItem = career.carrera
      careerId = await carreraController.getCarreraId(careerItem)

      // solo inserta una nueva carrera cuando esta no existe
      if(careerId === undefined) {
        lastCareerId = await carreraController.getLastCarreraId()
        newCareerId = lastCareerId + 1

        await carreraController.insertCarrera(newCareerId, careerItem)
      }
    }
  }

  if(semestersPath) {
    // Lee los semestres
    semesters = await csv().fromFile(semestersPath)

    for(semester of semesters) {
      semestreItem = semester.semestre
      semesterId = await semestreController.getSemestreId(semestreItem)

      // solo inserta un nuevo semestre cuando este no existe
      if(semesterId === undefined) {
        lastSemesterId = await semestreController.getLastSemestreId()

        newSemesterId = lastSemesterId + 1

        await semestreController.insertSemestre(newSemesterId, semestreItem, 0)
      }
    }
  }

  if(gpasPath) {
    // Lee la lista de gpas
    gpas = await csv().fromFile(gpasPath)

    // Inserta los gpas por semestre en la BD
    for(gpa of gpas) {
      let user = await usuarioViewController.getUserByEmail(gpa.correoInstitucional)
      let semesterId = await semestreController.getSemestreId(gpa.semestre)

      if(user !== undefined && semesterId !== undefined) {
        await gpaPorSemestreController.insertGPA(semesterId, user.id, gpa.gpa)
      }
    }

  }
  
}


 
module.exports = router;
