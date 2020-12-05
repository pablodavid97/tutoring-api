const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const usuarioViewController = require('../controllers/usuario-view.controller');
const estudianteController = require('../controllers/estudiante.controller');
const estudianteViewController = require('../controllers/estudiante-view.controller');
const reunionViewController = require('../controllers/reunion-view.controller');
const { logger } = require('../utils/logger');
const reunionController = require('../controllers/reunion.controller');
const notificacionController = require('../controllers/notificacion.controller');
const { reunion } = require('../models/connection-manager');

router.get('/', async (req, res) => {
  // converts request into json objects
  var requestRoles = req.query.userRoles;
  var length = requestRoles.length;

  userRoles = [];
  for (var i = 0; i < length; i++) {
    userRoles.push(JSON.parse(requestRoles[i]));
  }

  let isStudent = false;
  let isProfessor = false;
  for (rol of userRoles) {
    if (rol.rolId === 3) {
      isStudent = true;
    }

    if (rol.rolId === 2) {
      isProfessor = true;
    }
  }

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

      tutor = await usuarioViewController.getUserById(studentInfo.profesorId);

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
      req.body.semesterId,
      req.body.email,
      req.body.emailNotification
    );

    meetingId = await reunionViewController.getLastMeetingId();
    meeting.id = meetingId;

    notification = await notificacionController.createNotificacion(
      meetingId,
      req.body.studentId
    );

    res.json({ meeting, notification });
  } catch (error) {
    logger.error(error.message);
  }
});

router.post('/delete', async (req, res) => {
  try {
    // deletes previous notifications to avoid conflict
    await notificacionController.deleteAllNotificationsByMeetingId(
      req.body.meetingId
    );

    // changes meeting status
    await reunionController.deleteMeeting(req.body.meetingId, req.body.email);

    // creates new notification for student
    notification = await notificacionController.createNotificacion(
      req.body.meetingId,
      req.body.studentId
    );

    meeting = await reunionViewController.getReunionById(req.body.meetingId);

    res.json({ meeting });
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

    // deletes previous notifications to avoid conflict
    await notificacionController.deleteAllNotificationsByMeetingId(
      req.body.meetingId
    );

    // creates new notification for student
    notification = await notificacionController.createNotificacion(
      req.body.meetingId,
      req.body.studentId
    );

    meeting = await reunionViewController.getReunionById(req.body.meetingId);

    res.json({ meeting });
  } catch (error) {
    logger.error(error.message);
  }
});

router.post('/accept', async (req, res) => {
  try {
    meetingId = req.body.meetingId;
    comment = req.body.comment;
    notificationId = req.body.notificationId;
    profesorId = req.body.profesorId;
    email = req.body.email;

    await reunionController.editMeetingStatus(meetingId, 3, email);

    if (comment) {
      await reunionController.editMeetingStudentComment(
        meetingId,
        comment,
        email
      );
    }

    await notificacionController.deleteNotificacion(notificationId);

    notification = await notificacionController.createNotificacion(
      meetingId,
      profesorId
    );

    meeting = await reunionViewController.getReunionById(meetingId);

    res.json({ meeting });
  } catch (error) {
    logger.error(error.message);
  }
});

router.post('/reject', async (req, res) => {
  try {
    meetingId = req.body.meetingId;
    comment = req.body.comment;
    notificationId = req.body.notificationId;
    profesorId = req.body.profesorId;
    email = req.body.email;

    await reunionController.editMeetingStatus(meetingId, 4, email);
    await reunionController.editMeetingStudentComment(
      meetingId,
      comment,
      email
    );
    await notificacionController.deleteNotificacion(notificationId);

    notification = await notificacionController.createNotificacion(
      meetingId,
      profesorId
    );

    meeting = await reunionViewController.getReunionById(meetingId);

    res.json({ meeting });
  } catch (error) {
    logger.error(error.message);
  }
});

router.post('/done', async (req, res) => {
  try {
    meetingId = req.body.meetingId;
    meetingOption = req.body.meetingOption;
    isStudent = req.body.isStudent;
    isProfessor = req.body.isProfessor;
    comment = req.body.comment;
    notificationId = req.body.notificationId;

    meeting = await reunionViewController.getReunionById(meetingId);

    if (isStudent) {
      user = await usuarioViewController.getUserById(meeting.estudianteId);

      await reunionController.editMeetingStudentComment(
        meetingId,
        comment,
        user.correoInstitucional
      );
    }

    if (isProfessor) {
      user = await usuarioViewController.getUserById(meeting.profesorId);
      student = await usuarioViewController.getUserById(meeting.estudianteId);

      await reunionController.editMeetingProfessorComment(
        meetingId,
        comment,
        user.correoInstitucional
      );

      if (meetingOption === '0') {
        await reunionController.editMeetingStatus(
          meetingId,
          8,
          user.correoInstitucional
        );
      } else {
        await reunionController.editMeetingStatus(
          meetingId,
          7,
          user.correoInstitucional
        );
      }

      await notificacionController.deleteAllNotificationsByMeetingId(meetingId);

      // Creates notifications for student and professor when meeting is done
      await notificacionController.createNotificacion(meetingId, user.id);
      await notificacionController.createNotificacion(meetingId, student.id);
    }

    res.json({ meeting });
  } catch (error) {
    logger.error(error.message);
  }
});

router.post('/reschedule', async (req, res) => {
  try {
    await reunionController.rescheduleMeeting(
      req.body.subject,
      req.body.description,
      req.body.date,
      req.body.email,
      req.body.meetingId
    );

    await notificacionController.deleteAllNotificationsByMeetingId(
      req.body.meetingId
    );

    await notificacionController.createNotificacion(
      req.body.meetingId,
      req.body.studentId
    );

    meeting = await reunionViewController.getReunionById(req.body.meetingId);

    res.json({ meeting });
  } catch (error) {
    logger.error(error.message);
  }
});

module.exports = router;
