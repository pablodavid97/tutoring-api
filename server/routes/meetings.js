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
  console.log('Req: ', req.query);
  isStudent = parseInt(req.query.rolId) === 3;
  isProfessor = parseInt(req.query.rolId) === 2;
  studentInfo = {};
  tutor = {};
  students = {};
  meetings = {};
  lastRowId = 0;

  console.log('Is Professor: ', isProfessor);

  try {
    if (isStudent) {
      studentInfo = await estudianteViewController.getEstudianteById(
        req.query.userId
      );
      console.log('Estudiante: ', studentInfo);

      tutor = await usuarioController.getUserById(studentInfo.profesorId);
      console.log('Tutor: ', tutor);

      meetings = await reunionViewController.getReunionesByStudent(
        req.query.userId
      );

      console.log('Meetings: ', meetings);
    } else if (isProfessor) {
      students = await estudianteViewController.getAllEstudiantesByProfessor(
        req.query.userId
      );
      console.log('Estudiantes: ', students);

      meetings = await reunionViewController.getReunionesByProfessor(
        req.query.userId
      );
      console.log('Meetings: ', meetings);

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

    console.log("Meeting: ", meetingId);

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
  console.log('Got in!');
  console.log('Params: ', req.body);
  try {
    await reunionController.deleteMeeting(req.body.meetingId, req.body.email);

    res.json({ status: 'ok' });
  } catch (error) {
    logger.error(error.message);
  }
});

router.get('/meeting-by-id', async (req, res) => {
  try {
    meeting = await reunionViewController.getReunionById(req.query.meetingId);

    console.log('meeting: ', meeting);

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
      req.body.studentId,
      req.body.email,
      req.body.meetingId
    );
    res.json({ status: 'ok' });
  } catch (error) {
    logger.error(error);
  }
});

module.exports = router;
