const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const estudianteController = require('../controllers/estudiante.controller');
const estudianteViewController = require('../controllers/estudiante-view.controller');
const reunionViewController = require('../controllers/reunion-view.controller');
const { logger } = require('../utils/logger');
const reunionController = require('../controllers/reunion.controller');
const notificacionController = require('../controllers/notificacion.controller');

router.get('/', async (req, res) => {
  isStudent = parseInt(req.query.rolId) === 3;
  isProfessor = parseInt(req.query.rolId) === 2;
  studentInfo = {};
  tutor = {};
  students = {};
  meetings = {};
  lastRowId = 0;

  try {
    if (isStudent) {
      studentInfo = await estudianteViewController.getEstudianteById(
        req.query.userId
      );

      tutor = await usuarioController.getUserById(studentInfo.profesorId);

      meetings = await reunionViewController.getReunionesByStudent(
        req.query.userId
      );

    } else if (isProfessor) {
      students = await estudianteViewController.getAllEstudiantesByProfessor(
        req.query.userId
      );

      meetings = await reunionViewController.getReunionesByProfessor(
        req.query.userId
      );

      lastRowId = await reunionViewController.getLastMeetingId();
    }

    res.json({ studentInfo, tutor, students, meetings, lastRowId });
  } catch (error) {
    logger.error(error.message);
  }
});

router.post('/create', async (req, res) => {
  try {
    meeting = await reunionController.createMeeting(
      req.body.subject,
      req.body.description,
      req.body.date,
      req.body.professorId,
      req.body.studentId,
      req.body.email
    );

    meetingId = await reunionViewController.getLastMeetingId()

    notification = await notificacionController.createNotificacion(
      meetingId,
      req.body.studentId
    )

    res.json({meeting, notification});
  } catch (error) {
    logger.error(error.message);
  }
});

router.post('/delete', async (req, res) => {
  try {
    await reunionController.deleteMeeting(req.body.meetingId, req.body.email);

    notification = await notificacionController.createNotificacion(
      req.body.meetingId,
      req.body.studentId,
    )

    res.json({ status: 'ok' });
  } catch (error) {
    logger.error(error.message);
  }
});

router.get('/meeting-by-id', async (req, res) => {
  try {
    meeting = await reunionViewController.getReunionById(req.query.meetingId);

    res.json(meeting);
  } catch (error) {
    logger.error(error);
  }
});

router.post('/edit', async (req, res) => {
  try {
    await reunionController.editMeeting(
      req.body.subject,
      req.body.description,
      req.body.date,
      req.body.email,
      req.body.meetingId
    );

    notification = await notificacionController.createNotificacion(
      req.body.meetingId,
      req.body.studentId,
    )

    res.json({ status: 'ok' });
  } catch (error) {
    logger.error(error.message);
  }
});

router.post('/accept', async (req, res) => {
  try {
    meetingId = req.body.meetingId 
    comment = req.body.comment
    notificationId = req.body.notificationId
    profesorId = req.body.profesorId
    email = req.body.email

    await reunionController.editMeetingStatus(meetingId, 3, email) 

    if(comment) {
      await reunionController.editMeetingStudentComment(meetingId, comment, email)
    }

    await notificacionController.deleteNotificacion(notificationId)

    notification = await notificacionController.createNotificacion(
      meetingId,
      profesorId
    )

    res.json({ status: 'ok' });

  } catch (error) {
    logger.error(error.message)
  }
})

router.post('/reject', async (req, res) => {
  try {
    meetingId = req.body.meetingId 
    comment = req.body.comment
    notificationId = req.body.notificationId
    profesorId = req.body.profesorId
    email = req.body.email

    await reunionController.editMeetingStatus(meetingId, 4, email) 
    await reunionController.editMeetingStudentComment(meetingId, comment, email)
    await notificacionController.deleteNotificacion(notificationId)

    notification = await notificacionController.createNotificacion(
      meetingId,
      profesorId
    )

    res.json({ status: 'ok' });
  } catch (error) {
    logger.error(error.message)
  }
})

router.post('/done', async (req, res) => {
  try {
    console.log("Datos Ingresados: ", req.body);

    meetingId = req.body.meetingId
    meetingOption = req.body.meetingOption
    isStudent = req.body.isStudent
    isProfessor = req.body.isProfessor
    comment = req.body.comment
    notificationId = req.body.notificationId

    reunion = await reunionViewController.getReunionById(meetingId)

    if(isStudent) {
      user = await usuarioController.getUserById(reunion.estudianteId)

      await reunionController.editMeetingStudentComment(meetingId, comment, user.correoInstitucional)

      await notificacionController.deleteNotificacion(notificationId)
    }

    if(isProfessor) {
      user = await usuarioController.getUserById(reunion.profesorId)

      await reunionController.editMeetingProfessorComment(meetingId, comment, user.correoInstitucional)

      if(meetingOption === 0) {
        await reunionController.editMeetingStatus(meetingId, 8, user.correoInstitucional)
      } else {
        await reunionController.editMeetingStatus(meetingId, 7, user.correoInstitucional)
      }

      await notificacionController.deleteNotificacion(notificationId)
    }

    res.json({ status: 'ok' });


  } catch (error) {
    logger.error(error.message)
  }
});

module.exports = router;
