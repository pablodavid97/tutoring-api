const { log } = require('winston');
const database = require('../models/connection-manager');
const { logger } = require('../utils/logger');
const { Sequelize } = require('sequelize');
const reunion = database.reunion;
const reunionController = {};
const notificationController = require('./notificacion.controller');
const notificacionController = require('./notificacion.controller');

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
  email
) => {
  try {
    meeting = await reunion.create(
      {
        tema: subject,
        descripcion: description,
        fecha: date,
        profesorId: professorId,
        estudianteId: studentId,
        estadoId: 1,
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

reunionController.getReuniones = async () => {
  try {
    reuniones = await reunion.findAll();

    return reuniones;
  } catch (error) {
    logger.error(error.message);
  }
};

reunionController.setDailyMeetings = async () => {
  try {
    meetings = await reunionController.getReuniones();
    meetingsNum = meetings.length;

    dateTime = new Date();
    currentDate = getDate(dateTime);

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
