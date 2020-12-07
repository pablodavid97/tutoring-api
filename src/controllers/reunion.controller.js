const { log } = require('winston');
const database = require('../models/connection-manager');
const { logger } = require('../utils/logger');
const { Sequelize } = require('sequelize');
const reunion = database.reunion;
const reunionController = {};
const notificationController = require('./notificacion.controller');
const notificacionController = require('./notificacion.controller');
const axiosInstance = require('../http-client');

// SELECT *
reunionController.find = async () => {
  try {
    const meeting = await reunion.findAll();
    return meeting;
  } catch (error) {
    console.error(error.message);
  }
};

// CREATE MEETING
reunionController.createMeeting = async (
  subject,
  description,
  date,
  professorId,
  studentId,
  semestreId,
  email,
  emailNotification
) => {
  try {
    meeting = await reunion.create(
      {
        tema: subject,
        descripcion: description,
        fecha: date,
        profesorId: professorId,
        estudianteId: studentId,
        semestreId: semestreId,
        estadoId: 1,
        emailNotificacion: emailNotification,
        createdBy: email,
        createdOn: new Date()
      },
      {
        fields: [
          'tema',
          'descripcion',
          'fecha',
          'profesorId',
          'estudianteId',
          'estadoId',
          'emailNotificacion',
          'semestreId',
          'createdBy',
          'createdOn'
        ]
      }
    );
    return meeting.dataValues;
  } catch (error) {
    logger.error(error.message);
  }
};

// DELETE MEETING (SET MEETING STATUS TO 5)
reunionController.deleteMeeting = async (reunionId, userEmail) => {
  try {
    await reunion.update(
      { estadoId: 5, updatedOn: new Date(), updatedBy: userEmail },
      {
        where: {
          id: reunionId
        }
      }
    );
  } catch (error) {
    logger.error(error.message);
  }
};

reunionController.editMeeting = async (
  subject,
  description,
  date,
  email,
  meetingId
) => {
  try {
    await reunion.update(
      {
        tema: subject,
        descripcion: description,
        fecha: date,
        estadoId: 2,
        updatedOn: new Date(),
        updatedBy: email
      },
      {
        where: {
          id: meetingId
        }
      }
    );
  } catch (error) {
    logger.error(error.message);
  }
};

reunionController.rescheduleMeeting = async (
  subject,
  description,
  date,
  email,
  meetingId
) => {
  try {
    await reunion.update(
      {
        tema: subject,
        descripcion: description,
        fecha: date,
        estadoId: 1,
        updatedOn: new Date(),
        updatedBy: email
      },
      {
        where: {
          id: meetingId
        }
      }
    );
  } catch (error) {
    logger.error(error.message);
  }
};

reunionController.editMeetingStatus = async (meetingId, statusId, email) => {
  try {
    await reunion.update(
      { estadoId: statusId, updatedBy: email, updatedOn: new Date() },
      {
        where: {
          id: meetingId
        }
      }
    );
  } catch (error) {
    logger.error(error.message);
  }
};

reunionController.editMeetingStudentComment = async (
  meetingId,
  comment,
  email
) => {
  try {
    await reunion.update(
      {
        comentariosEstudiante: comment,
        updatedBy: email,
        updatedOn: new Date()
      },
      {
        where: {
          id: meetingId
        }
      }
    );
  } catch (error) {
    logger.error(error.message);
  }
};

reunionController.editMeetingProfessorComment = async (
  meetingId,
  comment,
  email
) => {
  try {
    await reunion.update(
      { comentariosProfesor: comment, updatedBy: email, updatedOn: new Date() },
      {
        where: {
          id: meetingId
        }
      }
    );
  } catch (error) {
    logger.error(error.message);
  }
};

reunionController.getAllReuniones = async () => {
  try {
    reuniones = await reunion.findAll();

    return reuniones;
  } catch (error) {
    logger.error(error.message);
  }
};

reunionController.setDailyMeetings = async () => {
  try {
    meetings = await reunionController.getAllReuniones();
    meetingsNum = meetings.length;

    dateTime = new Date();
    currentDate = getDate(dateTime);

    // only sets daily meetings if date is current date and student has accepted meeting
    for (var i = 0; i < meetingsNum; i++) {
      if (
        getDate(meetings[i].fecha) === currentDate &&
        meetings[i].estadoId === 3
      ) {
        if (meetings[i].estadoId !== 6) {
          await reunionController.editMeetingStatus(
            meetings[i].id,
            6,
            'system'
          );

          notification = await notificacionController.getNotificationByMeetingId(
            meetings[i].id
          );

          notificationController.deleteNotificacion(notification.id);

          // creates notifications for professor and student
          notificationController.createNotificacion(
            meetings[i].id,
            meetings[i].estudianteId
          );
          notificationController.createNotificacion(
            meetings[i].id,
            meetings[i].profesorId
          );

          // sends email notifications if enabled
          if (meetings[i].emailNotificacion) {
            studentRequest = await axiosInstance.get('/user-by-id', {
              params: { userId: meetings[i].estudianteId }
            });
            student = studentRequest.data;
            professorRequest = await axiosInstance.get('/user-by-id', {
              params: { userId: meetings[i].profesorId }
            });
            professor = professorRequest.data;

            meetings[i].estadoId = 6;

            // sends notification to professor and student
            emailRequest1 = await axiosInstance.post(
              '/send-meeting-notification',
              {
                student: student,
                professor: professor,
                meeting: meetings[i],
                isProfessor: true
              }
            );
            emailJSON1 = emailRequest1.data;

            emailRequest2 = await axiosInstance.post(
              '/send-meeting-notification',
              {
                student: student,
                professor: professor,
                meeting: meetings[i],
                isStudent: true
              }
            );
            emailJSON2 = emailRequest2.data;
          }
        }
      }
    }
  } catch (error) {
    logger.error(error.message);
  }
};

function getDate(datetime) {
  date =
    datetime.getFullYear() +
    '/' +
    (datetime.getMonth() + 1) +
    '/' +
    datetime.getDate();
  return date;
}

module.exports = reunionController;
